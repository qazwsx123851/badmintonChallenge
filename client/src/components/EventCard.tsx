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
  const isOpen = status === "\u958b\u653e\u5831\u540d";
  const isFull =
    maxParticipants !== undefined && currentRegistrations >= maxParticipants;
  const progress =
    maxParticipants !== undefined && maxParticipants > 0
      ? (currentRegistrations / maxParticipants) * 100
      : 0;

  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_45px_-24px_rgba(15,23,42,0.25)]"
    >
      <div className="absolute -top-16 -right-10 h-40 w-40 bg-primary/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-16 left-12 h-40 w-40 bg-secondary/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 p-7 space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Badge
              variant="default"
              className={cn(
                "rounded-full px-4 py-1 text-xs tracking-widest uppercase",
                isOpen
                  ? "bg-primary text-white shadow-[0_12px_30px_-18px_rgba(37,99,235,0.55)]"
                  : "bg-slate-100 text-slate-600"
              )}
              data-testid={`badge-status-${id}`}
            >
              {status}
            </Badge>
            <h3
              className="text-[1.8rem] font-semibold text-slate-900 leading-tight"
              data-testid={`text-event-name-${id}`}
            >
              {name}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              {format(startTime, "yyyy/MM/dd")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-[auto,1fr] gap-4 text-sm text-slate-600">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-100">
            <Users className="w-5 h-5 text-slate-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-slate-800">
                {currentRegistrations}
                {maxParticipants !== undefined
                  ? ` / ${maxParticipants}`
                  : ""}{" "}
                \u4eba\u5831\u540d
              </span>
              {maxParticipants !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold",
                    progress >= 90
                      ? "text-rose-500"
                      : progress >= 70
                      ? "text-amber-500"
                      : "text-emerald-500",
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
                className="h-2 bg-slate-100 rounded-full"
                indicatorClassName="bg-gradient-to-r from-primary via-sky-400 to-blue-600"
              />
            )}

            <p className="text-xs text-slate-500 leading-relaxed">
              \u6700\u65b0\u8cfd\u7a0b\u8cc7\u8a0a\u6703\u540c\u6b65\u5bc4\u9001\u81f3\u53c3\u8cfd\u8005\u4fe1\u7bb1\uff0c\u8acb\u5728\u5831\u540d\u5f8c\u7559\u610f\u901a\u77e5\u3002
            </p>
          </div>
        </div>

        <footer className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button
              className="flex-1 rounded-full font-semibold text-base shadow-[0_10px_24px_-16px_rgba(37,99,235,0.55)]"
              disabled={!isOpen || isFull}
              onClick={() => onRegister?.(id)}
              data-testid={`button-register-${id}`}
            >
              {isFull ? "\u540d\u984d\u5df2\u6eff" : "\u7acb\u5373\u5831\u540d"}
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-100"
              data-testid={`button-details-${id}`}
            >
              <Info className="w-4 h-4 mr-2" />
              \u6d3b\u52d5\u8a73\u60c5
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex-1 justify-center gap-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200"
              data-testid={`button-calendar-${id}`}
            >
              <CalendarPlus className="w-4 h-4" />
              \u52a0\u5165\u884c\u4e8b\u66c6
            </Button>
            <Button
              variant="ghost"
              className="flex-1 justify-center gap-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200"
              data-testid={`button-share-${id}`}
            >
              <Share2 className="w-4 h-4" />
              \u5206\u4eab\u6d3b\u52d5
            </Button>
          </div>
        </footer>
      </div>
    </motion.article>
  );
}
