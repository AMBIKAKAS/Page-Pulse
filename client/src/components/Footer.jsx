
import { Heart, Globe } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-800 pt-10">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl">

        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">

          <div>
            <h2 className="text-xl font-bold text-white">
              🚀 Page Pulse
            </h2>

            <p className="mt-2 text-slate-400">
              Website Performance & SEO Audit Tool
            </p>
          </div>

          <div className="flex gap-5">

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-slate-800 p-4 transition hover:bg-cyan-500"
            >
              <FaGithub size={22} />
            </a>

            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-slate-800 p-4 transition hover:bg-purple-500"
            >
              <Globe />
            </a>

          </div>

        </div>

        <div className="my-8 h-px bg-slate-800"></div>

        <p className="text-center text-slate-400">
          Built with <Heart size={16} className="inline text-red-500" /> for{" "}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-cyan-400"
          >
            Digital Heroes Training Task
          </a>
        </p>

      </div>
    </footer>
  );
}