const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

export function MockBanner() {
  if (!MOCK_MODE) return null;
  return (
    <div className="bg-amber-400 text-amber-900 text-xs font-bold text-center py-1.5 px-4 tracking-wide">
      ⚠️ MODE MOCK ACTIF — Les données sont simulées, aucune requête réelle n'est envoyée
    </div>
  );
}
