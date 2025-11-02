"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Users, Search, Lock, Globe, PlusCircle } from "lucide-react";
import Link from "next/link";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { communityCategories } from '@/lib/constants'; // Import centralized categories


interface Community {
  id: string;
  name: string;
  objectives: string;
  category: string;
  is_public: boolean;
  join_code: string | null;
  owner_id: string;
  member_count?: number; // Will be fetched separately or counted
  is_member?: boolean; // Client-side flag
}

const joinCommunitySchema = z.object({
  joinCode: z.string().length(6, "Le code de jointure doit contenir 6 chiffres.").optional(),
});

export default function CommunitiesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [communities, setCommunities] = React.useState<Community[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [joiningCommunityId, setJoiningCommunityId] = React.useState<string | null>(null);
  const [isSubmittingJoin, setIsSubmittingJoin] = React.useState(false);

  const joinForm = useForm<z.infer<typeof joinCommunitySchema>>({
    resolver: zodResolver(joinCommunitySchema),
    defaultValues: { joinCode: "" },
  });

  const fetchCommunities = React.useCallback(async () => {
    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Veuillez vous connecter pour voir les communautés.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/communities?search=${searchTerm}&category=${selectedCategory}`);
      const result = await response.json();

      if (response.ok) {
        // For each community, check if the current user is a member
        const communitiesWithMembership = await Promise.all(result.communities.map(async (comm: Community) => {
          const { count, error: memberError } = await supabase
            .from('community_members')
            .select('id', { count: 'exact' })
            .eq('community_id', comm.id)
            .eq('user_id', user.id);

          if (memberError) {
            console.error("Error checking membership:", memberError);
            return { ...comm, is_member: false };
          }
          return { ...comm, is_member: (count || 0) > 0 };
        }));
        setCommunities(communitiesWithMembership);
      } else {
        toast.error(result.error || "Erreur lors du chargement des communautés.");
      }
    } catch (err) {
      console.error("Failed to fetch communities:", err);
      toast.error("Impossible de charger les communautés.");
    } finally {
      setLoading(false);
    }
  }, [supabase, router, searchTerm, selectedCategory]);

  React.useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const handleJoinCommunity = async (communityId: string, isPublic: boolean, joinCode?: string) => {
    setIsSubmittingJoin(true);
    try {
      const response = await fetch('/api/community/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId, isPublic, joinCode }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        fetchCommunities(); // Refresh the list
        setJoiningCommunityId(null); // Close dialog
        joinForm.reset();
      } else {
        toast.error(result.error || "Erreur lors de la jointure de la communauté.");
      }
    } catch (err) {
      console.error("Failed to join community:", err);
      toast.error("Une erreur inattendue est survenue lors de la jointure.");
    } finally {
      setIsSubmittingJoin(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg text-muted-foreground">Chargement des communautés...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center lg:text-left">Découvrir les Communautés</h1>
        <Link href="/dashboard/community/create" passHref>
          <Button asChild>
            <div>
              <PlusCircle className="mr-2 h-5 w-5" /> Créer une Communauté
            </div>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrer par catégorie" />
          </SelectTrigger>
          <SelectContent>
            {communityCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={fetchCommunities} disabled={loading}>
          <Search className="mr-2 h-5 w-5" /> Rechercher
        </Button>
      </div>

      {communities.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-card text-muted-foreground">
          <p className="text-xl mb-4">Aucune communauté trouvée.</p>
          <p className="mb-6">Soyez le premier à créer une communauté !</p>
          <Link href="/dashboard/community/create" passHref>
            <Button asChild size="lg">
              <div>
                <PlusCircle className="mr-2 h-5 w-5" /> Créer ma première communauté
              </div>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Card key={community.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {community.is_public ? <Globe className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-red-500" />}
                  {community.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Catégorie: {community.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 line-clamp-3">{community.objectives}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Membres: {community.member_count || 0}/100</span>
                  {community.is_member ? (
                    <Button variant="secondary" disabled>Déjà Membre</Button>
                  ) : (
                    <Dialog open={joiningCommunityId === community.id} onOpenChange={(open) => !open && setJoiningCommunityId(null)}>
                      <DialogTrigger asChild>
                        <Button onClick={() => setJoiningCommunityId(community.id)}>
                          {community.is_public ? "Rejoindre" : "Rejoindre avec code"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{community.is_public ? `Rejoindre ${community.name}` : `Rejoindre ${community.name} (Privée)`}</DialogTitle>
                          <DialogDescription>
                            {community.is_public
                              ? "Cliquez sur confirmer pour rejoindre cette communauté."
                              : "Veuillez entrer le code de jointure fourni par l'administrateur de la communauté."}
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...joinForm}>
                          <form onSubmit={joinForm.handleSubmit((data: z.infer<typeof joinCommunitySchema>) => handleJoinCommunity(community.id, community.is_public, data.joinCode))}>
                            {!community.is_public && (
                              <FormField
                                control={joinForm.control}
                                name="joinCode"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof joinCommunitySchema>, "joinCode"> }) => (
                                  <FormItem className="mb-4">
                                    <FormLabel>Code de Jointure</FormLabel>
                                    <FormControl>
                                      <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                          <InputOTPSlot index={0} />
                                          <InputOTPSlot index={1} />
                                          <InputOTPSlot index={2} />
                                          <InputOTPSlot index={3} />
                                          <InputOTPSlot index={4} />
                                          <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                      </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setJoiningCommunityId(null)} type="button">Annuler</Button>
                              <Button type="submit" disabled={isSubmittingJoin || (!community.is_public && (joinForm.getValues("joinCode")?.length !== 6))}>
                                {isSubmittingJoin ? "Jointure..." : "Confirmer"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}