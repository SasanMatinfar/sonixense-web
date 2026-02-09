export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} soniXense</div>

        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition">
            Imprint
          </a>
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}