import {
  Gift,
  GraduationCap,
  Leaf,
  Sparkles,
  Stethoscope,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import type { EventType } from "./types";

type EventStyle = {
  icon: LucideIcon;
  badge: string;
  solid: string;
  soft: string;
  ring: string;
};

export const EVENT_STYLES: Record<EventType, EventStyle> = {
  Cleanup: {
    icon: Trash2,
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300",
    solid: "bg-sky-500",
    soft: "bg-sky-50 dark:bg-sky-950/40",
    ring: "ring-sky-200 dark:ring-sky-900",
  },
  Plantation: {
    icon: Leaf,
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
    solid: "bg-emerald-500",
    soft: "bg-emerald-50 dark:bg-emerald-950/40",
    ring: "ring-emerald-200 dark:ring-emerald-900",
  },
  Donation: {
    icon: Gift,
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
    solid: "bg-amber-500",
    soft: "bg-amber-50 dark:bg-amber-950/40",
    ring: "ring-amber-200 dark:ring-amber-900",
  },
  Education: {
    icon: GraduationCap,
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300",
    solid: "bg-violet-500",
    soft: "bg-violet-50 dark:bg-violet-950/40",
    ring: "ring-violet-200 dark:ring-violet-900",
  },
  Health: {
    icon: Stethoscope,
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300",
    solid: "bg-rose-500",
    soft: "bg-rose-50 dark:bg-rose-950/40",
    ring: "ring-rose-200 dark:ring-rose-900",
  },
  Others: {
    icon: Sparkles,
    badge: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    solid: "bg-neutral-500",
    soft: "bg-neutral-100 dark:bg-neutral-900",
    ring: "ring-neutral-200 dark:ring-neutral-800",
  },
};

export function eventStyle(type: EventType) {
  return EVENT_STYLES[type] || EVENT_STYLES.Others;
}
