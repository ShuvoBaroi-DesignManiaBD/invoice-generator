export const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#0A0A0B] pt-20 pb-10 transition-colors duration-300">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
        <div className="col-span-2 lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold italic text-white shadow-sm">
              IG
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
              Invoice
              <span className="text-indigo-600 dark:text-indigo-400 italic">
                Generator
              </span>
            </h1>
          </div>
          <p className="text-zinc-600 dark:text-white/40 max-w-sm leading-relaxed text-sm">
            The world&apos;s most intuitive invoicing tool for modern
            professionals. Designed for speed, accuracy, and professional
            aesthetics.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500 dark:text-white/60">
            Product
          </h4>
          <ul className="text-zinc-600 dark:text-white/40 text-sm space-y-2 font-medium">
            <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
              Real-time Editor
            </li>
            <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
              Dashboard
            </li>
            <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
              Client Hub
            </li>
            <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
              Settings
            </li>
          </ul>
        </div>

        {/* <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500 dark:text-white/60">
              Resources
            </h4>
            <ul className="text-zinc-600 dark:text-white/40 text-sm space-y-2 font-medium">
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
                Help Center
              </li>
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
                Tutorials
              </li>
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
                API Docs
              </li>
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
                Blog
              </li>
            </ul>
          </div> */}

        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500 dark:text-white/60">
            Legal
          </h4>
          <ul className="text-zinc-600 dark:text-white/40 text-sm space-y-2 font-medium">
            <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
              Privacy Policy
            </li>
            <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
              Terms
            </li>
            <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
              Security
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500 dark:text-white/60">
            Socials
          </h4>
          <ul className="text-zinc-600 dark:text-white/40 text-sm space-y-2 font-medium">
            <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
              Twitter
            </li>
            <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
              GitHub
            </li>
            <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
              LinkedIn
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-10 border-t border-zinc-200 dark:border-white/5 flex flex-col md:flex-row justify-center items-center gap-4 text-[10px] text-zinc-400 dark:text-white/30 tracking-widest font-black uppercase">
        <p>
          © {new Date().getFullYear()} INVOICE GENERATOR. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};
