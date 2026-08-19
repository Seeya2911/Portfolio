import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { FileUp, Loader2, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";

const categories = ["profile", "resume", "certificate", "project", "other"] as const;
type Category = (typeof categories)[number];
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.includes(",") ? result.split(",", 2)[1] : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export default function AssetManager() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<Category>("project");
  const [message, setMessage] = useState<string | null>(null);
  const assetsQuery = trpc.portfolioAssets.list.useQuery();
  const uploadMutation = trpc.portfolioAssets.upload.useMutation({
    onSuccess: async () => {
      setMessage("File uploaded successfully.");
      await assetsQuery.refetch();
    },
    onError: (error) => setMessage(error.message),
  });

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setMessage(null);
    if (!allowedTypes.includes(file.type)) {
      setMessage("Choose a JPG, PNG, WebP, or PDF file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setMessage("Files must be 8 MB or smaller.");
      return;
    }
    try {
      const contentBase64 = await fileToBase64(file);
      await uploadMutation.mutateAsync({
        category,
        filename: file.name,
        mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "application/pdf",
        contentBase64,
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="border-b border-border pb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Portfolio storage</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Asset manager</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Upload profile photos, resumes, certificates, and project evidence to private object storage. Metadata is kept in the database; file bytes are not stored in database columns.</p>
        </header>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <label className="grid gap-2 text-sm font-medium">Asset category
              <select value={category} onChange={(event) => setCategory(event.target.value as Category)} className="h-10 rounded-md border border-border bg-background px-3 text-sm">
                {categories.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}
              </select>
            </label>
            <div>
              <input ref={inputRef} type="file" accept={allowedTypes.join(",")} className="sr-only" onChange={(event) => handleUpload(event.target.files?.[0])} />
              <Button type="button" onClick={() => inputRef.current?.click()} disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                {uploadMutation.isPending ? "Uploading…" : "Choose file"}
              </Button>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Accepted: JPG, PNG, WebP, and PDF. Maximum size: 8 MB.</p>
          {message && <p className="mt-4 border-l-2 border-primary pl-3 text-sm text-muted-foreground" role="status">{message}</p>}
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Stored files</p><h2 className="mt-1 text-xl font-semibold">Your uploaded assets</h2></div>
            <span className="text-sm text-muted-foreground">{assetsQuery.data?.length ?? 0} files</span>
          </div>
          {assetsQuery.isLoading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading assets…</div> : assetsQuery.data?.length ? (
            <div className="grid gap-3">
              {assetsQuery.data.map((asset) => <article key={asset.id} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate font-medium">{asset.filename}</p><p className="mt-1 text-xs uppercase tracking-[0.14em] text-primary">{asset.category} · {formatBytes(asset.sizeBytes)}</p></div><a className="inline-flex shrink-0 items-center gap-2 text-sm text-primary hover:underline" href={asset.storageUrl} target="_blank" rel="noreferrer">Open file <ExternalLink className="h-4 w-4" /></a></article>)}
            </div>
          ) : <div className="rounded-lg border border-dashed border-border p-8 text-sm text-muted-foreground">No uploads yet. Choose a category and add your first asset.</div>}
        </section>
      </div>
    </div>
  );
}
