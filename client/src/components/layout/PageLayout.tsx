import { motion } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";

interface PageLayoutProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  actionSlot?: ReactNode;
  heroIcon?: ReactNode;
}

export default function PageLayout({
  title,
  subtitle,
  actionSlot,
  heroIcon,
  children,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[34px] border border-white/10 px-6 sm:px-10 py-9 sm:py-12 md-elevation-2"
        >
          <div className="hero-glow" aria-hidden />

          <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/2 to-transparent pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              {heroIcon && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                  className="flex size-16 sm:size-20 rounded-[28px] bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/80 text-white items-center justify-center shadow-[0_20px_40px_-18px_rgba(124,94,255,0.45)] border border-white/25"
                >
                  {heroIcon}
                </motion.div>
              )}

              <div className="space-y-2">
                <h1 className="text-[clamp(2.25rem,4vw,3.5rem)] font-semibold text-white tracking-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-base sm:text-lg text-white/78 max-w-2xl leading-relaxed drop-shadow-[0_3px_12px_rgba(0,0,0,0.4)]">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {actionSlot && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
                className="flex items-center gap-3 px-3 py-2 rounded-full bg-white/6 border border-white/20 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.45)]"
              >
                {actionSlot}
              </motion.div>
            )}
          </div>
        </motion.header>

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
