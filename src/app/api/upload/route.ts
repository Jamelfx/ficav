import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { NextRequest, NextResponse } from "next/server";

// Initialiser Firebase (une seule fois)
let firebaseApp: any = null;

function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error("FIREBASE_PROJECT_ID manquante");
  }

  firebaseApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  return firebaseApp;
}

// Set max request duration
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez: JPG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    // Validation de la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Le fichier ne doit pas dépasser 10MB" },
        { status: 400 }
      );
    }

    // Créer un nom unique pour le fichier
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    
    // Extraire l'extension du fichier
    const fileExtension = file.name.split(".").pop() || "jpg";
    const filename = `uploads/${timestamp}-${randomId}.${fileExtension}`;

    // Récupérer les bytes du fichier
    const bytes = await file.arrayBuffer();

    // Télécharger vers Firebase Storage
    const app = getFirebaseApp();
    const storage = getStorage(app);
    const bucket = storage.bucket();
    const file_ref = bucket.file(filename);

    await file_ref.save(Buffer.from(bytes), {
      metadata: {
        contentType: file.type,
      },
    });

    // Rendre le fichier public
    await file_ref.makePublic();

    // Construire l'URL publique Firebase
    const url = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filename}`;

    return NextResponse.json({
      url,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erreur lors du téléchargement" },
      { status: 500 }
    );
  }
}
