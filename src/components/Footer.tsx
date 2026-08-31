export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-alat-gradient flex items-center justify-center font-bold text-xs">
            A
          </div>
          <span className="font-medium">
            ALAT <span className="text-white/40">by Wema</span>
          </span>
        </div>
        <p className="text-sm text-white/40 text-center">
          Modern redesign · Not an official Wema product · For demo & learning
        </p>
        <div className="flex gap-6 text-sm text-white/50">
          <a href="https://alat.ng" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            alat.ng
          </a>
          <a href="https://playground.alat.ng" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            Developers
          </a>
          <a href="https://github.com/appycody58-byte/alat-tudy-samuel" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            Source
          </a>
        </div>
      </div>
    </footer>
  );
}
