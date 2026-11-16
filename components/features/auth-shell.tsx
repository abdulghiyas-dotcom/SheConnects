import { Brand } from "./brand"

type Props = {
  /** Replaces the logo on the left of the top bar (e.g. a Back button). */
  topLeft?: React.ReactNode
  /** Right side of the top bar: "Already have an account? Sign in". */
  topRight?: React.ReactNode
  /** Skip the centred column and let the page lay itself out (split screens). */
  bare?: boolean
  children: React.ReactNode
}

/** Frame for signed-out screens: marketing-style top bar over the indigo wash. */
export function AuthShell({ topLeft, topRight, bare = false, children }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <div aria-hidden className="bg-wash-center pointer-events-none absolute inset-0" />
      <header className="relative z-10 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {topLeft ?? <Brand tagline />}
          {topRight && <div className="text-sm text-slate-500">{topRight}</div>}
        </div>
      </header>
      {bare ? (
        <div className="relative flex flex-1 flex-col">{children}</div>
      ) : (
        <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-14">
          {children}
        </main>
      )}
    </div>
  )
}

/** Inline text link used in auth copy. */
export const authLinkClass = "font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
