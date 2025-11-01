import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, Trophy, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "\u6d3b\u52d5\u5217\u8868", testId: "link-events" },
  { href: "/teams", label: "\u7403\u968a\u7ba1\u7406", testId: "link-teams" },
  { href: "/courts", label: "\u5834\u5730\u7ba1\u7406", testId: "link-courts" },
  { href: "/matches", label: "\u8cfd\u7a0b\u8868", testId: "link-matches" },
  { href: "/admin", label: "\u5f8c\u53f0\u7ba1\u7406", testId: "link-admin" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const progress = useSpring(scrollY, {
    stiffness: 120,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    return scrollY.on("change", (value) => {
      setScrolled(value > 24);
    });
  }, [scrollY]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 font-medium text-slate-900 transition-colors">
      <motion.div
        style={{ scaleX: progress }}
        className="origin-left h-0.5 bg-primary/70"
      />

      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-[0_14px_36px_-24px_rgba(15,23,42,0.25)]"
            : "bg-white/75 backdrop-blur-lg border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between h-16"
            style={{ scale: scrolled ? 0.98 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Trophy className="w-7 h-7 text-primary" />
              <span className="text-[clamp(1.1rem,2vw,1.4rem)] font-semibold tracking-wide">
                \u7fbd\u7403\u8cfd\u4e8b
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link href={item.href} key={item.href}>
                  <Button
                    variant="ghost"
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    data-testid={item.testId}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="ml-3">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-sm"
                  data-testid="button-profile"
                >
                  <User className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-700 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen((open) => !open)}
              data-testid="button-menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="md:hidden py-4 space-y-2 bg-white/95 border border-slate-200 mx-4 mt-2 rounded-2xl px-2 shadow-lg backdrop-blur-lg"
        >
          {NAV_ITEMS.map((item) => (
            <Link href={item.href} key={`mobile-${item.href}`}>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-700 hover:bg-slate-100"
                data-testid={`${item.testId}-mobile`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
