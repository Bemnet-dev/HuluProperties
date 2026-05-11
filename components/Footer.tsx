import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="hidden md:block w-full py-16 mt-20 border-t border-zinc-200 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div className="col-span-1">
            <div className="text-xl font-black text-emerald-900 mb-4 uppercase tracking-widest">Hulu Properties</div>
            <p className="text-sm leading-relaxed text-zinc-600 max-w-xs">
              Defining premium assets. A curated marketplace for the most discerning investors.
            </p>
          </div>
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-zinc-900 mb-4 text-sm uppercase tracking-widest">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm text-zinc-600 hover:text-emerald-800 transition-colors">Assets</Link></li>
                <li><Link href="/listings" className="text-sm text-zinc-600 hover:text-emerald-800 transition-colors">Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 mb-4 text-sm uppercase tracking-widest">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/contact" className="text-sm text-zinc-600 hover:text-emerald-800 transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-sm text-zinc-600 hover:text-emerald-800 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">© 2026 HULU PROPERTIES. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
