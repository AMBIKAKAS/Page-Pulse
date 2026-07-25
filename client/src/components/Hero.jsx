import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative mb-20 text-center">

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-6 py-3 text-cyan-300 backdrop-blur-xl">

          <Sparkles size={18} />

          <span className="font-medium">
            AI Powered Website Intelligence
          </span>

        </div>

      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .2 }}
        className="mt-10 text-7xl font-black tracking-tight text-white"
      >

        Page

        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          {" "}Pulse
        </span>

      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .4 }}
        className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300"
      >
        Audit any website instantly.
        Measure performance, metadata,
        accessibility, page structure,
        response time and SEO signals
        from one elegant dashboard.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .6 }}
        className="mt-12 flex justify-center gap-5"
      >

        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-4 backdrop-blur-xl">

          <ShieldCheck className="mx-auto mb-2 text-cyan-400" />

          <p className="text-sm text-slate-400">
            Secure Parsing
          </p>

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-4 backdrop-blur-xl">

          <Sparkles className="mx-auto mb-2 text-purple-400" />

          <p className="text-sm text-slate-400">
            Beautiful Reports
          </p>

        </div>

      </motion.div>

    </section>
  );
}