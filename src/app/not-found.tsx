import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'segmentation fault · portfolio.sh',
}

export default function NotFound() {
  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-8">
      <div className="max-w-xl w-full">
        <div className="border border-white/[0.06] rounded-xl p-6 sm:p-10 bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.04]">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs font-mono text-muted">portfolio.sh</span>
          </div>

          <div className="space-y-3 font-mono text-sm sm:text-base">
            <p className="text-red-400/80">
              segmentation fault (core dumped)
            </p>
            <p className="text-white/70">
              <span className="text-accent">trace:</span> requested route not found in /home/dan
            </p>
            <p className="text-muted/60">
              there is no spoon. (also, no page.)
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="tap-target text-accent hover:text-white transition-colors duration-200 uppercase tracking-widest text-xs"
              >
                cd /home →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
