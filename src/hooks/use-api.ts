import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseApiOptions<T> {
  url: string;
  initialData?: T;
}

interface UseApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  create: (payload: Partial<T>) => Promise<T | null>;
  update: (id: string, payload: Partial<T>) => Promise<T | null>;
  delete: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useApi<T>({ url, initialData }: UseApiOptions<T>): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [url, toast]);

  const create = useCallback(
    async (payload: Partial<T>) => {
      try {
        setLoading(true);
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to create");
        const result = await response.json();
        toast({
          title: "Succès",
          description: "Élément créé avec succès",
        });
        await fetch();
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors de la création";
        toast({
          title: "Erreur",
          description: message,
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, toast, fetch]
  );

  const update = useCallback(
    async (id: string, payload: Partial<T>) => {
      try {
        setLoading(true);
        const response = await fetch(`${url}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to update");
        const result = await response.json();
        toast({
          title: "Succès",
          description: "Élément mis à jour",
        });
        await fetch();
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour";
        toast({
          title: "Erreur",
          description: message,
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, toast, fetch]
  );

  const deleteFn = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const response = await fetch(`${url}/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete");
        toast({
          title: "Succès",
          description: "Élément supprimé",
        });
        await fetch();
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
        toast({
          title: "Erreur",
          description: message,
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [url, toast, fetch]
  );

  return {
    data,
    loading,
    error,
    fetch,
    create,
    update,
    delete: deleteFn,
    refetch: fetch,
  };
}
