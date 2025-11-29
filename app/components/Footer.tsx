export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400 flex flex-col sm:flex-row sm:justify-between">
        <div>
          <p className="text-slate-200 font-medium">SheConnects</p>
          <p>Impact-driven remote service studio powered by Afghan women.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p>
            Contact:{" "}
            <a href="mailto:hello@sheconnects.work" className="underline">
              hello@sheconnects.work
            </a>
          </p>
          <p className="mt-2">© {new Date().getFullYear()} SheConnects</p>
        </div>
      </div>
    </footer>
  );
}
