import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob | null;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // --- SIMULATION DE LA TRANSCRIPTION VOCALE ---
    // Dans une application réelle, vous intégreriez ici un service de reconnaissance vocale (STT)
    // comme Google Cloud Speech-to-Text, AWS Transcribe, ou un autre fournisseur.
    // Cela impliquerait :
    // 1. L'envoi du 'audioFile' au service STT.
    // 2. La gestion de la réponse du service STT.
    // 3. L'extraction du texte transcrit.

    // Pour cette démonstration, nous allons renvoyer un texte de substitution.
    // Vous pouvez imaginer que le contenu de l'audio était :
    const simulatedTranscription = "Bonjour l'IA, peux-tu lister mes sites s'il te plaît ?";
    // Ou une transcription plus dynamique basée sur l'heure, etc.
    // const dynamicSimulatedTranscription = `Ceci est une transcription simulée de votre audio à ${new Date().toLocaleTimeString('fr-FR')}.`;

    console.log("Audio file received. Simulating transcription...");
    console.log("Simulated transcription:", simulatedTranscription);

    return NextResponse.json({ transcribedText: simulatedTranscription }, { status: 200 });

  } catch (error: any) {
    console.error("Error in audio transcription API:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred during transcription' }, { status: 500 });
  }
}