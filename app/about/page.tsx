import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | TogetherWeCan",
  description:
    "Learn how TogetherWeCan brings volunteers and organizers together to create meaningful local change.",
};

const values = [
  {
    icon: HeartHandshake,
    title: "Community comes first",
    text: "We make it easier for neighbors to connect, care for one another, and work toward shared goals.",
  },
  {
    icon: ShieldCheck,
    title: "Open to everyone",
    text: "Volunteering should feel welcoming. We make opportunities easy to discover and simple to join.",
  },
  {
    icon: Leaf,
    title: "Small steps add up",
    text: "Local action can create lasting change. Every hour, helping hand, and idea has a place here.",
  },
];

const goals = [
  "Connect people with causes and events in their communities.",
  "Give organizers a simple way to bring volunteers together.",
  "Help turn one-time participation into lasting community involvement.",
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-neutral-200/70 bg-gradient-to-b from-brand-50 via-white to-white dark:border-neutral-800 dark:from-brand-950/40 dark:via-neutral-950 dark:to-neutral-950">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        <div className="pointer-events-none absolute -right-16 -top-20 -z-0 h-72 w-72 rounded-full bg-lime-300/30 blur-3xl dark:bg-brand-500/10" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div className="animate-fade-up">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">
              <Sparkles size={14} /> About TogetherWeCan
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
              Good things happen when <span className="text-brand-600 dark:text-brand-400">we show up.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg">
              TogetherWeCan brings volunteers and organizers together around local causes. Find a meaningful way to help, meet people who care, and turn small actions into shared progress.
            </p>
            <Link href="/events" className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700">
              Find an event <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative animate-fade-up rounded-[2rem] border border-brand-200 bg-white/80 p-7 shadow-xl shadow-brand-900/5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80 sm:p-9">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20"><Users size={25} /></span>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-400">Our belief</p>
            <p className="mt-2 text-2xl font-black leading-snug tracking-tight text-neutral-900 dark:text-white">A stronger community starts with people choosing to care.</p>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">We make that first step easier, whether you are joining an event or bringing an idea of your own to life.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
        <article className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-9">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"><HeartHandshake size={21} /></span>
          <h2 className="mt-5 text-2xl font-black tracking-tight text-neutral-900 dark:text-white">Our mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">To make community service more accessible by helping people discover local opportunities, meet fellow volunteers, and organize events that make a practical difference.</p>
        </article>
        <article className="rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-lime-50 p-7 dark:border-brand-900 dark:from-brand-950/40 dark:via-neutral-900 dark:to-lime-950/20 sm:p-9">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 text-brand-950"><Compass size={21} /></span>
          <h2 className="mt-5 text-2xl font-black tracking-tight text-neutral-900 dark:text-white">Our vision</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">A world where anyone can find their place in making things better—and where local communities have the people and support to turn shared care into lasting change.</p>
        </article>
      </section>

      <section className="border-y border-neutral-200/70 bg-white py-16 dark:border-neutral-800 dark:bg-neutral-900/40 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">What guides us</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">Our goals, built around people.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {goals.map((goal, index) => (
              <div key={goal} className="flex gap-4 rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-sm font-black text-brand-700 dark:bg-brand-950 dark:text-brand-300">0{index + 1}</span>
                <p className="pt-1 text-sm font-semibold leading-relaxed text-neutral-700 dark:text-neutral-200">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">Why choose TogetherWeCan</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">Make it easy to make a difference.</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">A friendly place to find your next step, connect with local people, and create something good together.</p>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-brand-700">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"><Icon size={22} /></span>
              <h3 className="mt-5 text-lg font-extrabold text-neutral-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-brand-950 p-7 text-white sm:p-10 lg:flex-row lg:items-center">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-300">Be part of it</p><h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">There is a place for you here.</h2><p className="mt-2 text-sm text-brand-100/75">Find a cause you care about or start an event of your own.</p></div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/events" className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-extrabold text-brand-950 transition hover:-translate-y-0.5 hover:bg-lime-200">Explore events <ArrowRight size={15} /></Link>
            <Link href="/create-event" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15">Host an event</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
