import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY;
const KIE_AI_BASE_URL = "https://api.kie.ai/api/v1/jobs";

if (!KIE_AI_API_KEY) {
  console.error("KIE_AI_API_KEY n'est pas définie dans les variables d'environnement.");
}

const createVideoTaskSchema = z.object({
  prompt: z.string().min(1, "Le prompt est requis.").max(10000, "Le prompt est trop long."),
  aspect_ratio: z.enum(["portrait", "landscape"]).default("landscape"),
  n_frames: z.enum(["10", "15"]).default("10"),
  remove_watermark: z.boolean().default(true),
});

const queryVideoTaskSchema = z.object({
  taskId: z.string().min(1, "L'ID de la tâche est requis."),
});

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user has access to AI video generation
  const { data: access, error: accessError } = await supabase
    .from('ai_video_access')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile && (profile.role === 'admin' || profile.role === 'super_admin');

  if (!access && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden: Vous n\'avez pas accès à la génération de vidéos IA.' }, { status: 403 });
  }

  if (!KIE_AI_API_KEY) {
    return NextResponse.json({ error: 'Kie.ai API Key non configurée.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const validationResult = createVideoTaskSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error for video generation:", validationResult.error);
      return NextResponse.json({ error: 'Invalid video generation data provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { prompt, aspect_ratio, n_frames, remove_watermark } = validationResult.data;

    const kieAiResponse = await fetch(`${KIE_AI_BASE_URL}/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIE_AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sora-2-text-to-video",
        input: {
          prompt,
          aspect_ratio,
          n_frames,
          remove_watermark,
        },
      }),
    });

    const kieAiResult = await kieAiResponse.json();

    if (!kieAiResponse.ok || kieAiResult.code !== 200) {
      console.error("Kie.ai API Error (createTask):", kieAiResult);
      return NextResponse.json({ error: kieAiResult.msg || 'Erreur lors de la création de la tâche de génération vidéo.' }, { status: kieAiResponse.status });
    }

    return NextResponse.json({ message: 'Tâche de génération vidéo créée avec succès.', taskId: kieAiResult.data.taskId }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for AI video generation (createTask):", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user has access to AI video generation
  const { data: access, error: accessError } = await supabase
    .from('ai_video_access')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile && (profile.role === 'admin' || profile.role === 'super_admin');

  if (!access && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden: Vous n\'avez pas accès à la génération de vidéos IA.' }, { status: 403 });
  }

  if (!KIE_AI_API_KEY) {
    return NextResponse.json({ error: 'Kie.ai API Key non configurée.' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    const validationResult = queryVideoTaskSchema.safeParse({ taskId });

    if (!validationResult.success) {
      console.error("Validation error for query task:", validationResult.error);
      return NextResponse.json({ error: 'Invalid taskId provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const kieAiResponse = await fetch(`${KIE_AI_BASE_URL}/recordInfo?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${KIE_AI_API_KEY}`,
      },
    });

    const kieAiResult = await kieAiResponse.json();

    if (!kieAiResponse.ok || kieAiResult.code !== 200) {
      console.error("Kie.ai API Error (recordInfo):", kieAiResult);
      return NextResponse.json({ error: kieAiResult.msg || 'Erreur lors de la récupération du statut de la tâche.' }, { status: kieAiResponse.status });
    }

    return NextResponse.json({ message: 'Statut de la tâche récupéré avec succès.', taskInfo: kieAiResult.data }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for AI video generation (recordInfo):", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}