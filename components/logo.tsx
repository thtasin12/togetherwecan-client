import { HeartHandshake } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
        <HeartHandshake size={20} />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">
        Together<span className="text-brand-600 dark:text-brand-400">WeCan</span>
      </span>
    </Link>
  );
}
