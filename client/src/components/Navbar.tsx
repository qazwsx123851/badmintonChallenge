import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { User, Menu, Trophy } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-xl">
            <Trophy className="w-7 h-7" />
            <span className="text-xl font-bold">羽球賽事</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" className="text-primary-foreground hover:bg-white/10" data-testid="link-events">活動列表</Button>
            </Link>
            <Link href="/teams">
              <Button variant="ghost" className="text-primary-foreground hover:bg-white/10" data-testid="link-teams">我的團隊</Button>
            </Link>
            <Link href="/courts">
              <Button variant="ghost" className="text-primary-foreground hover:bg-white/10" data-testid="link-courts">場地管理</Button>
            </Link>
            <Link href="/matches">
              <Button variant="ghost" className="text-primary-foreground hover:bg-white/10" data-testid="link-matches">賽程表</Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" className="text-primary-foreground hover:bg-white/10" data-testid="link-admin">管理後台</Button>
            </Link>
            <div className="ml-2">
              <Button variant="secondary" size="icon" className="rounded-full" data-testid="button-profile">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-white/10" data-testid="link-events-mobile">
                活動列表
              </Button>
            </Link>
            <Link href="/teams">
              <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-white/10" data-testid="link-teams-mobile">
                我的團隊
              </Button>
            </Link>
            <Link href="/courts">
              <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-white/10" data-testid="link-courts-mobile">
                場地管理
              </Button>
            </Link>
            <Link href="/matches">
              <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-white/10" data-testid="link-matches-mobile">
                賽程表
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-white/10" data-testid="link-admin-mobile">
                管理後台
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
