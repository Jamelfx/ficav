"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  maxSize?: number;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  hint = "JPG, PNG, WebP, GIF (max 10MB)",
  maxSize = 10,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      toast({
        title: "Erreur",
        description: `Le fichier ne doit pas dépasser ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Créer un FormData
      const formData = new FormData();
      formData.append("file", file);

      // Uploader
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'upload");
      }

      const data = await response.json();

      // Mettre à jour l'URL et l'aperçu
      onChange(data.url);
      setPreview(data.url);

      toast({
        title: "Succès",
        description: "Image téléchargée avec succès",
      });

      // Réinitialiser l'input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'upload",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>

      {preview ? (
        <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden group">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleRemove}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
            id="image-input"
          />
          <label htmlFor="image-input" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              {loading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-sm">
                  {loading ? "Téléchargement..." : "Cliquez ou glissez une image"}
                </p>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
