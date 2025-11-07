"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LayoutTemplate, MessageSquare, Loader2, ShieldCheck, Globe } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client<dyad-problem-report summary="12 problems">
<problem file="src/app/api/ai/generate-video/route.ts" line="139" column="60" code="2304">Cannot find name 'newCoinPoints'.</problem>
<problem file="src/components/admin/ManageAdmins.tsx" line="199" column="22" code="2552">Cannot find name 'Select'. Did you mean 'onselect'?</problem>
<problem file="src/components/admin/ManageAdmins.tsx" line="201" column="26" code="2304">Cannot find name 'SelectTrigger'.</problem>
<problem file="src/components/admin/ManageAdmins.tsx" line="202" column="28" code="2304">Cannot find name 'SelectValue'.</problem>
<problem file="src/components/admin/ManageAdmins.tsx" line="203" column="27" code="2304">Cannot find name 'SelectTrigger'.</problem>
<problem file="src/components/admin/ManageAdmins.tsx" line="205" column="24" code="2304">Cannot find name 'SelectContent'.</problem>
<problem file="src/components/admin/ManageAdmins.tsx" line="206" column="26" code="2304">Cannot find name 'SelectItem'.</problem>
<problem file="src/components/admin/ManageAdmins.tsx" line="206" column="58" code="2304">Cannot find name 'SelectItem'.</problem>
<problem file="src/components/admin/ManageAdmins.tsx" line="207" column="26" code="2304">Cannot find name 'SelectItem'.</problem>
<problem file="src/components/admin/ManageAdmins.tsx" line="207" column="78" code="2304">Cannot find name 'SelectItem'.</problem>
<problem file="src/components/admin/ManageAdmins.tsx" line="208" column="25" code="2304">Cannot find name 'SelectContent'.</problem>
<problem file="src/components/admin/ManageAdmins.tsx" line="209" column="23" code="2552">Cannot find name 'Select'. Did you mean 'onselect'?</problem>
</dyad-problem-report><think>**Investigating Compile Errors**

I'm currently focused on the initial error, "Cannot find name 'newCoinPoints'". It seems like a simple typo or missing variable declaration. I'll meticulously review the `route.ts` file, specifically line 139, to ensure proper variable definition or import. Addressing this could quickly resolve this issue.


**Resolving Missing Imports**

Now, I'm tackling the remaining errors. The `ManageAdmins.tsx` file is missing imports for the `shadcn/ui` Select components: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, and `SelectItem`.  I need to add the import statement to fix these 11 errors. Simultaneously, I've confirmed that the issue with `newCoinPoints` stems from its scope. I'm adjusting the logic so that `newCoinBalance` for super admins directly reflects their existing `profile.coin_points`.


</think>You're right, let's get these TypeScript errors sorted out!

The first error is due to `newCoinPoints` potentially being undefined if the user is a `super_admin`. For `super_admin` users, no coins are deducted, so their balance remains the same. I'll adjust the logic to reflect this.

The remaining errors in `src/components/admin/ManageAdmins.tsx` are all related to missing imports for the `Select` UI components. I'll add the necessary import statement to resolve these.

<dyad-write path="src/app/api/ai/generate-video/route.ts" description="Ensuring newCoinBalance is always defined for AI video generation.">
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY;
const KIE_AI_BASE_URL = "https://api.kie.ai/api/v1/jobs";
const VIDEO_GENERATION_COST = 30; // Cost in coins

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

  // Check if user has access to AI video generation (community_admin or super_admin or explicit access)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, coin_points')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Forbidden: Profil utilisateur non trouvé.' }, { status: 403 });
  }

  const isCommunityAdmin = profile.role === 'community_admin';
  const isSuperAdmin = profile.role === 'super_admin';
  let newCoinPoints = profile.coin_points; // Initialize newCoinPoints here

  const { data: access, error: accessError } = await supabase
    .from('ai_video_access')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!access && !isCommunityAdmin && !isSuperAdmin) {
    return NextResponse.json({ error: 'Forbidden: Vous n\'avez pas accès à la génération de vidéos IA.' }, { status: 403 });
  }

  // Deduct coins only if not a Super Admin (Super Admins have unlimited access)
  if (!isSuperAdmin) {
    if (profile.coin_points < VIDEO_GENERATION_COST) {
      return NextResponse.json({ error: `Fonds insuffisants. Vous avez besoin de ${VIDEO_GENERATION_COST} pièces pour générer une vidéo. Vous avez actuellement ${profile.coin_points} pièces.` }, { status: 403 });
    }

    newCoinPoints = profile.coin_points - VIDEO_GENERATION_COST;

    const { error: updateCoinsError } = await supabase
      .from('profiles')
      .update({ coin_points: newCoinPoints })
      .eq('id', user.id);

    if (updateCoinsError) {
      console.error("Error deducting coins for AI video generation:", updateCoinsError);
      return NextResponse.json({ error: 'Erreur lors de la déduction des pièces.' }, { status: 500 });
    }

    // Record transaction
    const { error: transactionError } = await supabase
      .from('coin_transactions')
      .insert({
        sender_id: user.id,
        recipient_id: user.id, // Self-deduction
        amount: -VIDEO_GENERATION_COST, // Negative for deduction
        transaction_type: 'ai_video_generation',
        description: 'Coût de génération de vidéo IA',
      });

    if (transactionError) {
      console.error("Error recording AI video generation transaction:", transactionError);
    }
  }

  if (!KIE_AI_API_KEY) {
    return NextResponse.json({ error: 'Kie.ai API Key non configurée.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const validationResult = createVideoTaskSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error for video generation:", validationResult.error);
      // If validation fails, and coins were already deducted, consider refunding them.
      // For simplicity, we'll assume validation happens client-side first.
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
      // If Kie.ai API fails, refund coins if they were deducted
      if (!isSuperAdmin) {
        await supabase.from('profiles').update({ coin_points: profile.coin_points }).eq('id', user.id);
        await supabase.from('coin_transactions').delete().eq('sender_id', user.id).eq('transaction_type', 'ai_video_generation').order('created_at', { ascending: false }).limit(1);
      }
      return NextResponse.json({ error: kieAiResult.msg || 'Erreur lors de la création de la tâche de génération vidéo.' }, { status: kieAiResponse.status });
    }

    return NextResponse.json({
      message: 'Tâche de génération vidéo créée avec succès.',
      taskId: kieAiResult.data.taskId,
      newCoinBalance: isSuperAdmin ? profile.coin_points : newCoinPoints, // Return updated balance
      deductedAmount: isSuperAdmin ? 0 : VIDEO_GENERATION_COST,
    }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for AI video generation (createTask):", error);
    // If an unexpected error occurs, refund coins if they were deducted
    if (!isSuperAdmin && profile) {
      await supabase.from('profiles').update({ coin_points: profile.coin_points }).eq('id', user.id);
      await supabase.from('coin_transactions').delete().eq('sender_id', user.id).eq('transaction_type', 'ai_video_generation').order('created_at', { ascending: false }).limit(1);
    }
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user has access to AI video generation (community_admin or super_admin or explicit access)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Forbidden: Profil utilisateur non trouvé.' }, { status: 403 });
  }

  const isCommunityAdmin = profile.role === 'community_admin';
  const isSuperAdmin = profile.role === 'super_admin';

  const { data: access, error: accessError } = await supabase
    .from('ai_video_access')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!access && !isCommunityAdmin && !isSuperAdmin) {
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