"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center bg-[#171310] text-[#E8D8B8]">
      <p className="text-[#C59A4A] text-sm tracking-widest uppercase mb-3">La Cachette</p>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl mb-3">Page indisponible</h1>
      <p className="text-[#E8D8B8]/60 text-sm max-w-md mb-8">
        Un contenu n’a pas pu se charger. Réessaie, ou reviens à l’accueil.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2 rounded-lg bg-[#C59A4A] text-[#171310] text-sm font-semibold"
        >
          Réessayer
        </button>
        <a href="/" className="px-5 py-2 rounded-lg border border-[#4A2C20] text-sm">
          Accueil
        </a>
      </div>
      {error.digest && (
        <p className="mt-6 text-[10px] text-[#E8D8B8]/30">ref {error.digest}</p>
      )}
    </main>
  );
}
