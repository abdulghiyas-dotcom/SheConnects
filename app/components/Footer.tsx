export default function Footer() {
  return (
    <footer className="border-t border-violet-100 bg-gradient-to-r from-white via-white to-violet-50">
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-6 text-xs text-slate-600 sm:flex-row sm:justify-between">
        <div>
          <p className="font-semibold text-slate-800">SheConnects</p>
          <p className="mt-1">Impact-driven remote service studio powered by Afghan women.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p>
            Contact:{" "}
            <a href="mailto:hello@sheconnects.work" className="underline">
              hello@sheconnects.work
            </a>
          </p>
          <p className="mt-2 text-slate-700">© {new Date().getFullYear()} SheConnects</p>
        </div>
      </div>
    </footer>
  );
}
