import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface FlipDigitProps {
  digit: string;
  delay?: number;
}

function FlipDigit({ digit, delay = 0 }: FlipDigitProps) {
  return (
    <div className="relative w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-28 perspective-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={digit}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{
            duration: 0.6,
            delay: delay,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="absolute inset-0 flex items-center justify-center bg-gray-800 border-2 border-gray-700 rounded-lg shadow-2xl"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Top half shadow */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/20 to-transparent rounded-t-lg pointer-events-none" />

          {/* Middle line */}
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-950/50 -translate-y-1/2" />

          {/* Number */}
          <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-100 tabular-nums select-none">
            {digit}
          </span>

          {/* Bottom half shadow */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent rounded-b-lg pointer-events-none" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface FlipCounterProps {
  value: number;
  minDigits?: number;
}

export function FlipCounter({ value, minDigits = 6 }: FlipCounterProps) {
  const [digits, setDigits] = useState<string[]>([]);

  useEffect(() => {
    const valueStr = value.toString().padStart(minDigits, "0");
    setDigits(valueStr.split(""));
  }, [value, minDigits]);

  return (
    <div className="flex gap-1 md:gap-2 lg:gap-3">
      {digits.map((digit, index) => (
        <FlipDigit
          key={`${index}-${digit}`}
          digit={digit}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
