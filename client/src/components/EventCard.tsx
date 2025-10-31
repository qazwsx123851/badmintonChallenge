import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  CalendarPlus,
  Clock,
  Flame,
  Info,
  Share2,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EventCardProps {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  status: string;
  currentRegistrations: number;
  maxParticipants?: number;
  onRegister?: (id: string) => void;
}

export default function EventCard({
  id,
  name,
  startTime,
  endTime,
  status,
  currentRegistrations,
  maxParticipants,
  onRegister,
}: EventCardProps) {
  const isOpen = status === "開放報名";
  const isFull =
    maxParticipants !== undefined && currentRegistrations >= maxParticipants;
  const progress =
    maxParticipants !== undefined && maxParticipants > 0
      ? (currentRegistrations / maxParticipants) * 100
      : 0;

  return (
    <motion.article
      whileHover={{ y: -10, rotateX: 2 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[28px] border border-white/12 backdrop-blur-xl bg-gradient-to-br from-white/14 via-white/6 to-white/4 dark:from-white/8 dark:via-white/6 dark:to-white/3 shadow-[0_24px_55px_-28px_rgba(15,23,42,0.45)]"
    >
      <div className="absolute -top-24 -right-20 size-48 bg-primary/35 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-16 left-1/2 size-48 bg-secondary/25 rounded-full blur-[80px] pointer-events-none" />

      <div className="p-6 space-y-6 relative z-10">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Badge
              variant="default"
              className={cn(
                "rounded-full px-4 py-1 text-xs tracking-widest uppercase border border-white/20",
                isOpen
                  ? "bg-primary/80 text-white shadow-[0_10px_26px_-18px_rgba(124,94,255,0.9)]"
                  : "bg-white/16 text-white/80 dark:bg-white/12"
              )}
              data-testid={`badge-status-${id}`}
            >
              {status}
            </Badge>
            <h3
              className="text-[1.75rem] font-semibold text-white leading-tight drop-shadow-[0_10px_35px_rgba(15,23,42,0.45)]"
              data-testid={`text-event-name-${id}`}
            >
              {name}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(startTime, "yyyy/MM/dd")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-[auto,1fr] gap-4 text-sm text-white/85">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/12 border border-white/18">
            <Users className="w-5 h-5 text-white/90" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className="text-base font-semibold text-white"
                data-testid={`text-registration-count-${id}`}
              >
                {currentRegistrations}
                {maxParticipants !== undefined
                  ? ` / ${maxParticipants}`
                  : ""}{" "}
                人報名
              </span>
              {maxParticipants !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold",
                    progress >= 90
                      ? "text-rose-300"
                      : progress >= 70
                      ? "text-amber-300"
                      : "text-emerald-300",
                  )}
                >
                  <Flame className="w-3 h-3" />
                  {progress.toFixed(0)}%
                </span>
              )}
            </div>

            {maxParticipants !== undefined && (
              <Progress
                value={progress}
                className="h-2 bg-white/14 border border-white/20 rounded-full"
                indicatorClassName="bg-gradient-to-r from-primary via-secondary to-primary/80 shadow-[0_6px_16px_rgba(124,94,255,0.5)]"
              />
            )}

            <p className="text-xs text-white/78 leading-relaxed">
              最新賽程資訊會同步寄送至參賽者信箱，請在報名後留意通知。
            </p>
          </div>
        </div>

        <footer className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button
              className="flex-1 rounded-full shadow-lg shadow-primary/20 font-semibold text-base"
              disabled={!isOpen || isFull}
              onClick={() => onRegister?.(id)}
              data-testid={`button-register-${id}`}
            >
              {isFull ? "名額已滿" : "立即報名"}
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/20 text-white/85 hover:text-white hover:bg-white/14"
              data-testid={`button-details-${id}`}
            >
              <Info className="w-4 h-4 mr-2" />
              活動詳情
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex-1 justify-center gap-2 rounded-full bg-white/10 hover:bg-white/16 text-white/85"
              data-testid={`button-calendar-${id}`}
            >
              <CalendarPlus className="w-4 h-4" />
              加入行事曆
            </Button>
            <Button
              variant="ghost"
              className="flex-1 justify-center gap-2 rounded-full bg-white/10 hover:bg-white/16 text-white/85"
              data-testid={`button-share-${id}`}
            >
              <Share2 className="w-4 h-4" />
              分享活動
            </Button>
          </div>
        </footer>
      </div>
    </motion.article>
  );
}
