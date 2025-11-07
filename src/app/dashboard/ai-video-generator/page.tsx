"use client";

import React from "react";
import { useForm, ControllerRenderProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Video, PlayCircle, RefreshCw, Film, Maximize2, Minimize2, CheckCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VIDEO_GENERATION_COST = 30; // Cost in coins

const videoGenerationSchema = z.object({
  prompt: z.string().min(10, "Le prompt doit contenir au moins 10 caractères.").max(10000, "Le prompt est trop long."),
  aspect_ratio: z.enum(["portrait", "landscape"]).default("landscape"),
  n_frames: z.enum(["10", "15"]).default("10"),
  remove_watermark: z.boolean().default(true),
});

interface GeneratedVideo {
  taskId: string;
  prompt: string;
  videoUrl: string | null;
  state: 'waiting' | 'success' | 'fail';
  createTime: number;
}

export default function AIVideoGeneratorPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loadingAccess, setLoadingAccess] = React.useState(true);
  const [hasAccess, setHasAccess] = React.useState(false);
  const [generatedVideos, setGeneratedVideos] = React.useState<GeneratedVideo[]>([]);
  const [activePollingTaskId, setActivePollingTaskId] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof videoGenerationSchema>>({
    resolver: zodResolver(videoGenerationSchema),
    defaultValues: {
      prompt: "",
      aspect_ratio: "landscape",
      n_frames: "10",
      remove_watermark: true,
    },
  });

  const checkAccess = React.useCallback(async () => {
    setLoadingAccess(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Veuillez vous connecter pour accéder à cette page.");
      router.push("/login");
      setLoadingAccess(false);
      return;
    }

    // Check ai_video_access table
    const { data: accessEntry, error: accessEntryError } = await supabase
      .from('ai_video_access')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Check user role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isCommunityAdmin = profile && profile.role === 'community_admin';
    const isSuperAdmin = profile && profile.role === 'super_admin';

    if (accessEntry || isCommunityAdmin || isSuperAdmin) {
      setHasAccess(true);
    } else {
      toast.error("Accès refusé. Vous n'avez pas les permissions pour générer des vidéos IA.");
      router.push("/dashboard/sites"); // Redirect if no access
    }
    setLoadingAccess(false);
  }, [supabase, router]);

  React.useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  const pollTaskStatus = React.useCallback(async (taskId: string) => {
    let attempts = 0;
    const maxAttempts = 60; // Poll for up to 5 minutes (60 * 5s)
    const interval = 5000; // Poll every 5 seconds

    return new Promise<string | null>((resolve, reject) => {
      const pollingInterval = setInterval(async () => {
        if (attempts >= maxAttempts) {
          clearInterval(pollingInterval);
          toast.error(`La tâche ${taskId} a dépassé le temps d'attente.`);
          setGeneratedVideos(prev => prev.map(video => video.taskId === taskId ? { ...video, state: 'fail' } : video));
          setActivePollingTaskId(null);
          return reject(new Error("Polling timed out"));
        }

        try {
          const response = await fetch(`/api/ai/generate-video?taskId=${taskId}`);
          const result = await response.json();

          if (!response.ok) {
            clearInterval(pollingInterval);
            toast.error(result.error || `Erreur lors de la récupération du statut de la tâche ${taskId}.`);
            setGeneratedVideos(prev => prev.map(video => video.taskId === taskId ? { ...video, state: 'fail' } : video));
            setActivePollingTaskId(null);
            return reject(new Error(result.error || "API error"));
          }

          const taskInfo = result.taskInfo;
          if (taskInfo.state === 'success') {
            clearInterval(pollingInterval);
            const resultJson = JSON.parse(taskInfo.resultJson);
            const videoUrl = resultJson.resultUrls?.[0] || null;
            toast.success(`Vidéo générée avec succès pour la tâche ${taskId} !`);
            setGeneratedVideos(prev => prev.map(video => video.taskId === taskId ? { ...video, videoUrl, state: 'success' } : video));
            setActivePollingTaskId(null);
            return resolve(videoUrl);
          } else if (taskInfo.state === 'fail') {
            clearInterval(pollingInterval);
            toast.error(`La génération vidéo a échoué pour la tâche ${taskId}: ${taskInfo.failMsg}`);
            setGeneratedVideos(prev => prev.map(video => video.taskId === taskId ? { ...video, state: 'fail' } : video));
            setActivePollingTaskId(null);
            return reject(new Error(taskInfo.failMsg || "Task failed"));
          }
        } catch (err: any) {
          console.error(`Error polling task ${taskId}:`, err);
          // Do not stop polling on network errors, just log and retry
        }
        attempts++;
      }, interval);
    });
  }, []);

  const onSubmit = async (values: z.infer<typeof videoGenerationSchema>) => {
    if (!hasAccess) {
      toast.error("Vous n'avez pas les permissions pour générer des vidéos IA.");
      return;
    }
    form.resetField("prompt"); // Clear prompt after submission
    form.setValue("prompt", ""); // Ensure prompt is cleared

    const newVideo: GeneratedVideo = {
      taskId: `temp-${Date.now()}`, // Temporary ID until we get a real one
      prompt: values.prompt,
      videoUrl: null,
      state: 'waiting',
      createTime: Date.now(),
    };
    setGeneratedVideos(prev => [newVideo, ...prev]); // Add to top of list

    try {
      const response = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await response.json();

      if (response.ok) {
        toast.info("Tâche de génération vidéo soumise. Cela peut prendre quelques minutes...");
        if (result.deductedAmount > 0) {
          toast.success(`-${result.deductedAmount} pièces. Votre nouveau solde est de ${result.newCoinBalance} pièces.`);
        }
        const realTaskId = result.taskId;
        setGeneratedVideos(prev => prev.map(video => video.taskId === newVideo.taskId ? { ...video, taskId: realTaskId } : video));
        setActivePollingTaskId(realTaskId);
        await pollTaskStatus(realTaskId);
      } else {
        toast.error(result.error || "Erreur lors de la soumission de la tâche de génération vidéo.");
        setGeneratedVideos(prev => prev.map(video => video.taskId === newVideo.taskId ? { ...video, state: 'fail' } : video));
      }
    } catch (err: any) {
      console.error("Failed to submit video generation task:", err);
      toast.error("Une erreur inattendue est survenue lors de la soumission de la tâche.");
      setGeneratedVideos(prev => prev.map(video => video.taskId === newVideo.taskId ? { ...video, state: 'fail' } : video));
    } finally {
      form.setValue("prompt", ""); // Ensure prompt is cleared even on error
    }
  };

  if (loadingAccess) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg text-muted-foreground">Vérification des permissions...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <Video className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Accès Refusé</CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions pour générer des vidéos IA.
              Veuillez contacter un administrateur si vous pensez que c'est une erreur.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Générateur de Vidéos IA (Sora 2)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de Génération */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-6 w-6" /> Créer une nouvelle vidéo
            </CardTitle>
            <CardDescription>
              Décrivez la vidéo que vous souhaitez générer avec Sora 2. Coût: {VIDEO_GENERATION_COST} pièces.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }: { field: ControllerRenderProps<z.infer<typeof videoGenerationSchema>, "prompt"> }) => (
                    <FormItem>
                      <FormLabel>Prompt (Description de la vidéo)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Un professeur donne une conférence animée dans une salle de classe, avec des diagrammes colorés au tableau. Il déclare : 'Sora 2 est maintenant disponible sur Kie AI...'"
                          className="min-h-[120px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="aspect_ratio"
                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof videoGenerationSchema>, "aspect_ratio"> }) => (
                      <FormItem>
                        <FormLabel>Aspect Ratio</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez l'aspect ratio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="landscape">Paysage (16:9)</SelectItem>
                            <SelectItem value="portrait">Portrait (9:16)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="n_frames"
                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof videoGenerationSchema>, "n_frames"> }) => (
                      <FormItem>
                        <FormLabel>Durée de la vidéo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez la durée" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="10">10 secondes</SelectItem>
                            <SelectItem value="15">15 secondes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || activePollingTaskId !== null}>
                  {form.formState.isSubmitting || activePollingTaskId !== null ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="mr-2 h-4 w-4" />
                  )}
                  {form.formState.isSubmitting || activePollingTaskId !== null ? "Génération en cours..." : "Générer la vidéo"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Vidéos Générées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-6 w-6" /> Mes vidéos générées
            </CardTitle>
            <CardDescription>
              Historique de vos générations de vidéos IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedVideos.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Aucune vidéo générée pour le moment.</p>
            ) : (
              <div className="space-y-6">
                {generatedVideos.map((video) => (
                  <div key={video.taskId} className="border rounded-lg p-4 shadow-sm space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Prompt: <span className="text-foreground">{video.prompt}</span></p>
                    <p className="text-sm text-muted-foreground">Statut:
                      {video.state === 'waiting' && <span className="ml-2 text-yellow-600 flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-1" /> En attente...</span>}
                      {video.state === 'success' && <span className="ml-2 text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Succès</span>}
                      {video.state === 'fail' && <span className="ml-2 text-red-600 flex items-center"><XCircle className="h-4 w-4 mr-1" /> Échec</span>}
                    </p>
                    {video.videoUrl ? (
                      <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
                        <video controls src={video.videoUrl} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      video.state === 'waiting' && (
                        <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-md">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="ml-2 text-muted-foreground">Génération en cours...</p>
                        </div>
                      )
                    )}
                    {video.state === 'waiting' && activePollingTaskId === video.taskId && (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Actualisation automatique...
                      </Button>
                    )}
                    {video.state === 'fail' && (
                      <Button variant="destructive" size="sm" className="w-full" onClick={() => toast.info("Fonctionnalité de re-tentative à implémenter.")}>
                        Réessayer
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}