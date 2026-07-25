import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617]">

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
          linear-gradient(to right,#ffffff 1px,transparent 1px),
          linear-gradient(to bottom,#ffffff 1px,transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Cyan Glow */}

      <motion.div
        animate={{
          x: [0, 80, -50, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
        }}
        className="absolute left-[-150px] top-[-150px] h-[500px] w-[500px] rounded-full bg-cyan-500/30 blur-[140px]"
      />

      {/* Purple Glow */}

      <motion.div
        animate={{
          x: [0, -120, 40, 0],
          y: [0, 80, -50, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
        }}
        className="absolute right-[-180px] top-[100px] h-[520px] w-[520px] rounded-full bg-purple-600/25 blur-[160px]"
      />

      {/* Blue Glow */}

      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -70, 30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 22,
        }}
        className="absolute bottom-[-180px] left-1/3 h-[480px] w-[480px] rounded-full bg-blue-600/25 blur-[160px]"
      />

      {/* Small Floating Orbs */}

      <motion.div
        animate={{
          y: [0, -40, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
        }}
        className="absolute left-[15%] top-[25%] h-6 w-6 rounded-full bg-cyan-400 shadow-[0_0_40px_#22d3ee]"
      />

      <motion.div
        animate={{
          y: [0, 35, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
        }}
        className="absolute right-[18%] top-[35%] h-5 w-5 rounded-full bg-violet-400 shadow-[0_0_35px_#a855f7]"
      />

      <motion.div
        animate={{
          y: [0, -25, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
        }}
        className="absolute bottom-[18%] left-[22%] h-4 w-4 rounded-full bg-blue-400 shadow-[0_0_30px_#60a5fa]"
      />

    </div>
  );
}