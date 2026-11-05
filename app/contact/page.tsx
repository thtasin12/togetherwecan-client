"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

import { api, ApiError } from "@/lib/api";

import {
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiX
} from "react-icons/si";
import { FaLinkedin as SiLinkedin } from "react-icons/fa";
import { useAuth } from "@/lib/auth-context";
import { Reveal } from "@/components/reveal";
import { toast } from "sonner";


const EMAIL = "hello@togetherwecan.org";

const PHONE = "+1 (555) 012-3456"; // placeholder

const ADDRESS = "123 Community Lane, Dhaka, Bangladesh 1200"; // placeholder



const TOPICS = ["General", "Hosting", "Report an issue", "Partnership", "Feedback"] as const;

type Topic = (typeof TOPICS)[number];



const SOCIAL_LINKS = [

  {

    icon: SiX,

    label: "Twitter / X",

    handle: "@togetherwecan",

    href: "https://twitter.com/togetherwecan",

    colour: "hover:text-sky-500 dark:hover:text-sky-400",

    ring: "hover:border-sky-300 dark:hover:border-sky-700",

  },

  {

    icon: SiInstagram,

    label: "Instagram",

    handle: "@togetherwecan",

    href: "https://instagram.com/togetherwecan",

    colour: "hover:text-pink-500 dark:hover:text-pink-400",

    ring: "hover:border-pink-300 dark:hover:border-pink-700",

  },

  {

    icon: SiFacebook,

    label: "Facebook",

    handle: "TogetherWeCan",

    href: "https://facebook.com/togetherwecan",

    colour: "hover:text-blue-600 dark:hover:text-blue-400",

    ring: "hover:border-blue-300 dark:hover:border-blue-700",

  },

  {

    icon: SiLinkedin,

    label: "LinkedIn",

    handle: "togetherwecan",

    href: "https://linkedin.com/company/togetherwecan",

    colour: "hover:text-blue-700 dark:hover:text-blue-400",

    ring: "hover:border-blue-300 dark:hover:border-blue-700",

  },

  {

    icon: SiGithub,

    label: "GitHub",

    handle: "togetherwecan",

    href: "https://github.com/togetherwecan",

    colour: "hover:text-neutral-900 dark:hover:text-white",

    ring: "hover:border-neutral-400 dark:hover:border-neutral-500",

  },

] as const;



const faqs = [

  {

    question: "How do I host an event?",

    answer:

      "Create a free account, then use the Host button in the navbar. Add a title, description, date, location and an optional capacity. Your event appears on the discovery page right away.",

  },

  {

    question: "Is it free to join?",

    answer:

      "Always. TogetherWeCan does not charge volunteers or organizers. All you need is an account to reserve a spot.",

  },

  {

    question: "How do waitlists work?",

    answer:

      "When an event reaches capacity you can join its waitlist. If someone leaves, the volunteer who has waited longest is promoted automatically and the spot becomes theirs.",

  },

  {

    question: "Can I edit or delete my event?",

    answer:

      "Yes. Open Manage Events from your account menu to update details or remove an event. Deleting an event also removes its joiners, saves, waitlist entries and comments.",

  },

];



const avatarTones = [

  "bg-brand-600 text-white",

  "bg-emerald-500 text-white",

  "bg-lime-400 text-brand-950",

];







type FormState = {

  name: string;

  email: string;

  topic: Topic;

  subject: string;

  message: string;

};



type Status = "idle" | "sending" | "sent";







function InfoCard({

  icon: Icon,

  label,

  children,

  delay = 0,

}: {

  icon: React.ElementType;

  label: string;

  children: React.ReactNode;

  delay?: number;

}) {

  return (

    <Reveal delay={delay}>

      <div className="flex gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-brand-700">

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">

          <Icon size={19} />

        </span>

        <div className="min-w-0">

          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-neutral-400">

            {label}

          </p>

          <div className="mt-1">{children}</div>

        </div>

      </div>

    </Reveal>

  );

}







export default function ContactPage() {

  const { user } = useAuth();

  const formRef = useRef<HTMLFormElement>(null);



  const [form, setForm] = useState<FormState>({

    name: "",

    email: "",

    topic: "General",

    subject: "",

    message: "",

  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const [status, setStatus] = useState<Status>("idle");

  const [reference, setReference] = useState("");



  useEffect(() => {

    if (!user) return;

    setForm((current) => ({

      ...current,

      name: current.name || user.name,

      email: current.email || user.email,

    }));

  }, [user]);



  const set = (key: keyof FormState, value: string) => {

    setForm((current) => ({ ...current, [key]: value }));

    setErrors((current) => ({ ...current, [key]: undefined }));

  };



  const validate = () => {

    const next: Partial<Record<keyof FormState, string>> = {};

    if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))

      next.email = "Enter a valid email address";

    if (form.subject.trim().length < 3) next.subject = "Subject must be at least 3 characters";

    if (form.message.trim().length < 20)

      next.message = "Message must be at least 20 characters";

    setErrors(next);

    return Object.keys(next).length === 0;

  };



  const submit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    if (status === "sending") return; // prevent duplicate submissions

    if (!validate()) {

      toast.error("Please fix the highlighted fields");

      return;

    }





    const website =

      (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value || "";



    setStatus("sending");

    try {

      const data = await api<{ message: string; reference?: string }>("/api/contact", {

        method: "POST",

        body: JSON.stringify({ ...form, website }),

      });

      setReference(data.reference || "");

      setStatus("sent");

      toast.success("Message sent!");

    } catch (err) {

      setStatus("idle");

      toast.error(err instanceof ApiError ? err.message : "Could not send your message");

    }

  };



  const resetForm = () => {

    setForm((current) => ({ ...current, subject: "", message: "" }));

    setErrors({});

    setReference("");

    setStatus("idle");

  };



  const copyEmail = async () => {

    try {

      await navigator.clipboard.writeText(EMAIL);

      toast.success("Email address copied");

    } catch {

      toast.error("Could not copy the email address");

    }

  };



  /* Shared style helpers */

  const inputCls =

    "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-brand-600 dark:focus:ring-brand-950 placeholder:text-neutral-400 dark:placeholder:text-neutral-600";

  const labelCls = "mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-200";

  const errEl = (key: keyof FormState) =>

    errors[key] ? (

      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-500">

        <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />

        {errors[key]}

      </p>

    ) : null;



  const sending = status === "sending";



  return (

    <div>



      <section className="relative overflow-hidden border-b border-neutral-200/70 bg-gradient-to-b from-brand-50 via-white to-white dark:border-neutral-800 dark:from-brand-950/40 dark:via-neutral-950 dark:to-neutral-950">



        <div className="pointer-events-none absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />

        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-lime-300/30 blur-3xl dark:bg-brand-500/10" />

        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-700/10" />



        <div className="relative mx-auto grid max-w-7xl items-end gap-8 px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:grid-cols-[1fr_340px]">

          {/* headline */}

          <div className="animate-fade-up">

            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">

              <Mail size={13} /> Get in Touch

            </p>

            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-[1.08] tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl">

              We&apos;d love to{" "}

              <span className="text-brand-600 dark:text-brand-400">hear from you.</span>

            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-base">

              Have a question, a partnership idea, or just want to say hello? Our community

              team reads every message and will get back to you within 1–2 business days.

            </p>





            <div className="mt-6 flex flex-wrap gap-3">

              {[

                { icon: Clock3, text: "Mon–Fri, 9am–6pm (GMT+6)" },

                { icon: Users, text: "Real people, not bots" },

                { icon: MessageCircle, text: "Community-first support" },

              ].map(({ icon: Icon, text }) => (

                <span

                  key={text}

                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-[11px] font-semibold text-brand-800 dark:border-brand-800 dark:bg-brand-950/60 dark:text-brand-300"

                >

                  <Icon size={12} />

                  {text}

                </span>

              ))}

            </div>

          </div>





          <div className="animate-fade-up rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-brand-900/5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">

            <div className="flex items-center gap-3">

              <div className="flex -space-x-2">

                {["TH", "AR", "MR"].map((initials, index) => (

                  <span

                    key={initials}

                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-[10px] font-extrabold dark:border-neutral-900 ${avatarTones[index]}`}

                  >

                    {initials}

                  </span>

                ))}

              </div>

              <div>

                <p className="text-sm font-extrabold text-neutral-900 dark:text-white">

                  Real humans, not a queue

                </p>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">

                  Community support team

                </p>

              </div>

            </div>



            <div className="mt-4 space-y-2">

              <div className="flex items-center gap-2 rounded-2xl bg-brand-50 px-3 py-2 text-[11px] font-semibold text-brand-800 dark:bg-brand-950/50 dark:text-brand-300">

                <Clock3 size={13} /> Average reply 1–2 business days

              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-neutral-50 px-3 py-2 text-[11px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">

                <CheckCircle2 size={13} className="text-brand-600 dark:text-brand-400" />

                Every message personally reviewed

              </div>

            </div>



            <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">

                Direct email

              </p>

              <a

                href={`mailto:${EMAIL}`}

                className="mt-1 flex items-center gap-1.5 text-sm font-extrabold text-brand-700 transition hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"

              >

                <Mail size={14} />

                {EMAIL}

              </a>

            </div>

          </div>

        </div>

      </section>



      <section className="border-b border-neutral-200/70 bg-neutral-50/60 py-10 dark:border-neutral-800 dark:bg-neutral-900/30">

        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <Reveal>

            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">

              Contact information

            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-3xl">

              How to reach us

            </h2>

          </Reveal>



          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Email */}

            <InfoCard icon={Mail} label="Email address" delay={0}>

              <div className="flex items-center justify-between gap-2">

                <a

                  href={`mailto:${EMAIL}`}

                  className="truncate text-sm font-extrabold text-neutral-900 transition hover:text-brand-700 dark:text-white dark:hover:text-brand-400"

                >

                  {EMAIL}

                </a>

                <button

                  type="button"

                  onClick={copyEmail}

                  aria-label="Copy email address"

                  title="Copy email address"

                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition hover:border-brand-300 hover:text-brand-700 dark:border-neutral-700 dark:hover:border-brand-700 dark:hover:text-brand-400"

                >

                  <Copy size={13} />

                </button>

              </div>

              <p className="mt-1 text-[11px] text-neutral-400">Replies within 1–2 business days</p>

            </InfoCard>



            {/* Phone */}

            <InfoCard icon={Phone} label="Phone number" delay={60}>

              <a

                href="tel:+15550123456"

                className="text-sm font-extrabold text-neutral-900 transition hover:text-brand-700 dark:text-white dark:hover:text-brand-400"

              >

                {PHONE}

              </a>

              <p className="mt-1 text-[11px] text-neutral-400">Mon–Fri, 9am–6pm (GMT+6)</p>

            </InfoCard>





            <InfoCard icon={MapPin} label="Office address" delay={120}>

              <p className="text-sm font-extrabold leading-snug text-neutral-900 dark:text-white">

                {ADDRESS}

              </p>

              <p className="mt-1 text-[11px] text-neutral-400">Community operations hub</p>

            </InfoCard>



            {/* Office hours */}

            <InfoCard icon={Clock3} label="Support hours" delay={180}>

              <p className="text-sm font-extrabold text-neutral-900 dark:text-white">

                Mon – Fri

              </p>

              <p className="text-sm font-extrabold text-neutral-900 dark:text-white">

                9:00 AM – 6:00 PM

              </p>

              <p className="mt-1 text-[11px] text-neutral-400">Bangladesh Standard Time (GMT+6)</p>

            </InfoCard>

          </div>



          <Reveal delay={80}>

            <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">

              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-neutral-400">

                Find us on social media

              </p>

              <div className="mt-4 flex flex-wrap gap-3">

                {SOCIAL_LINKS.map(({ icon: Icon, label, handle, href, colour, ring }) => (

                  <a

                    key={label}

                    href={href}

                    target="_blank"

                    rel="noopener noreferrer"

                    aria-label={label}

                    className={`group flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-bold text-neutral-600 transition dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 ${colour} ${ring}`}

                  >

                    <Icon size={15} className="transition" />

                    <span>{handle}</span>

                    <ExternalLink

                      size={11}

                      className="opacity-0 transition group-hover:opacity-100"

                    />

                  </a>

                ))}

              </div>

            </div>

          </Reveal>

        </div>

      </section>



      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">

        <div className="grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">



          <Reveal>

            <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">

              {status === "sent" ? (

                <div

                  role="status"

                  aria-live="polite"

                  className="flex flex-col items-center py-8 text-center sm:py-12"

                >

                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-700 shadow-lg shadow-brand-100 dark:bg-brand-950 dark:text-brand-300 dark:shadow-brand-950">

                    <CheckCircle2 size={36} />

                  </span>

                  <h2 className="mt-5 text-2xl font-black tracking-tight text-neutral-900 dark:text-white">

                    Message sent!

                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">

                    Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}. We&apos;ll reply to{" "}

                    <span className="font-semibold text-neutral-700 dark:text-neutral-200">

                      {form.email}

                    </span>{" "}

                    within 1–2 business days.

                  </p>

                  {reference && (

                    <p className="mt-4 rounded-full bg-neutral-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">

                      Reference {reference}

                    </p>

                  )}

                  <div className="mt-6 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

                    <button

                      type="button"

                      onClick={resetForm}

                      className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"

                    >

                      Send another

                    </button>

                    <Link

                      href="/events"

                      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"

                    >

                      Browse events <ArrowRight size={15} />

                    </Link>

                  </div>

                </div>

              ) : (

                <>

                  <div className="flex items-start gap-3">

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">

                      <Send size={19} />

                    </span>

                    <div>

                      <h2 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">

                        Send us a message

                      </h2>

                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">

                        The more detail you share, the faster we can help.

                      </p>

                    </div>

                  </div>



                  <form ref={formRef} onSubmit={submit} className="mt-6 space-y-5" noValidate>



                    <div className="grid gap-4 sm:grid-cols-2">

                      <div>

                        <label htmlFor="contact-name" className={labelCls}>

                          Full name <span className="text-rose-500">*</span>

                        </label>

                        <input

                          id="contact-name"

                          className={`${inputCls} ${errors.name ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-600 dark:focus:ring-rose-950" : ""}`}

                          placeholder="Your full name"

                          autoComplete="name"

                          value={form.name}

                          aria-invalid={Boolean(errors.name)}

                          aria-describedby={errors.name ? "err-name" : undefined}

                          onChange={(event) => set("name", event.target.value)}

                        />

                        {errEl("name")}

                      </div>

                      <div>

                        <label htmlFor="contact-email" className={labelCls}>

                          Email address <span className="text-rose-500">*</span>

                        </label>

                        <input

                          id="contact-email"

                          type="email"

                          className={`${inputCls} ${errors.email ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-600 dark:focus:ring-rose-950" : ""}`}

                          placeholder="you@example.com"

                          autoComplete="email"

                          value={form.email}

                          aria-invalid={Boolean(errors.email)}

                          aria-describedby={errors.email ? "err-email" : undefined}

                          onChange={(event) => set("email", event.target.value)}

                        />

                        {errEl("email")}

                      </div>

                    </div>





                    <div>

                      <span className={labelCls}>What is this about?</span>

                      <div className="flex flex-wrap gap-2">

                        {TOPICS.map((topic) => {

                          const active = form.topic === topic;

                          return (

                            <button

                              key={topic}

                              type="button"

                              aria-pressed={active}

                              onClick={() => set("topic", topic)}

                              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${

                                active

                                  ? "bg-brand-600 text-white shadow-sm"

                                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"

                              }`}

                            >

                              {topic}

                            </button>

                          );

                        })}

                      </div>

                    </div>



                    <div>

                      <label htmlFor="contact-subject" className={labelCls}>

                        Subject <span className="text-rose-500">*</span>

                      </label>

                      <input

                        id="contact-subject"

                        className={`${inputCls} ${errors.subject ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-600 dark:focus:ring-rose-950" : ""}`}

                        maxLength={120}

                        placeholder="A short summary of your message"

                        value={form.subject}

                        aria-invalid={Boolean(errors.subject)}

                        onChange={(event) => set("subject", event.target.value)}

                      />

                      {errEl("subject")}

                    </div>





                    <div>

                      <div className="flex items-center justify-between">

                        <label htmlFor="contact-message" className={labelCls}>

                          Message <span className="text-rose-500">*</span>

                        </label>

                        <span

                          className={`text-[11px] font-medium transition ${

                            form.message.length > 750

                              ? "text-rose-500"

                              : "text-neutral-400"

                          }`}

                        >

                          {form.message.length}/800

                        </span>

                      </div>

                      <textarea

                        id="contact-message"

                        rows={6}

                        maxLength={800}

                        className={`${inputCls} resize-y ${errors.message ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-600 dark:focus:ring-rose-950" : ""}`}

                        placeholder="Tell us what happened, what you need, or what you are dreaming up…"

                        value={form.message}

                        aria-invalid={Boolean(errors.message)}

                        onChange={(event) => set("message", event.target.value)}

                      />

                      {errEl("message")}

                    </div>





                    <div

                      className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"

                      aria-hidden="true"

                    >

                      <label htmlFor="website">Website</label>

                      <input id="website" name="website" tabIndex={-1} autoComplete="off" />

                    </div>





                    <div className="flex flex-col gap-3 border-t border-neutral-100 pt-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">

                      <p className="text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">

                        We reply to the email above. No spam, ever.

                      </p>

                      <button

                        type="submit"

                        disabled={sending}

                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-emerald-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"

                      >

                        {sending ? (

                          <>

                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                            Sending…

                          </>

                        ) : (

                          <>

                            <Send size={15} /> Send message

                          </>

                        )}

                      </button>

                    </div>

                  </form>

                </>

              )}

            </section>

          </Reveal>



          <div className="space-y-5">

            {/* FAQ */}

            <Reveal delay={60}>

              <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

                <div className="flex items-center gap-2">

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">

                    <MessageCircle size={17} />

                  </span>

                  <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">

                    Common questions

                  </h2>

                </div>

                <div className="mt-4 space-y-2">

                  {faqs.map((faq) => (

                    <details

                      key={faq.question}

                      className="group rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition open:bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:open:bg-neutral-900"

                    >

                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-neutral-800 dark:text-neutral-200 [&::-webkit-details-marker]:hidden">

                        {faq.question}

                        <ChevronDown

                          size={16}

                          className="shrink-0 text-neutral-400 transition group-open:rotate-180"

                        />

                      </summary>

                      <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">

                        {faq.answer}

                      </p>

                    </details>

                  ))}

                </div>

              </section>

            </Reveal>



            <Reveal delay={100}>

              <section className="rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-lime-50 p-6 dark:border-brand-900 dark:from-brand-950/40 dark:via-neutral-900 dark:to-lime-950/20">

                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">

                  <HeartHandshake size={20} />

                </span>

                <p className="mt-4 text-sm font-extrabold text-neutral-900 dark:text-white">

                  Hosting something and stuck?

                </p>

                <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">

                  We can help with capacity, waitlists, or updating event details.

                </p>

                <Link

                  href="/manage-events"

                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline dark:text-brand-400"

                >

                  Manage my events <ArrowRight size={13} />

                </Link>

              </section>

            </Reveal>



            <Reveal delay={140}>

              <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-neutral-400">

                  Our commitment

                </p>

                <div className="mt-4 space-y-3">

                  {[

                    {

                      icon: Clock3,

                      title: "1–2 business days",

                      desc: "Average response time for all enquiries",

                    },

                    {

                      icon: Users,

                      title: "Real human review",

                      desc: "Every message is personally read by our team",

                    },

                    {

                      icon: CheckCircle2,

                      title: "No auto-replies",

                      desc: "We respond with genuine, helpful answers",

                    },

                  ].map(({ icon: Icon, title, desc }) => (

                    <div key={title} className="flex items-start gap-3">

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">

                        <Icon size={15} />

                      </span>

                      <div>

                        <p className="text-sm font-bold text-neutral-900 dark:text-white">

                          {title}

                        </p>

                        <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">

                          {desc}

                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </section>

            </Reveal>

          </div>

        </div>



        <Reveal delay={80}>

          <div className="mt-12 overflow-hidden rounded-[2rem] bg-brand-950 px-6 py-8 text-white sm:px-10">

            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">

              <div>

                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-300">

                  <Sparkles size={12} /> Not here to talk?

                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">

                  There is probably an event for that.

                </h2>

                <p className="mt-1 text-sm text-brand-100/70">

                  Browse upcoming causes or start one of your own.

                </p>

              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

                <Link

                  href="/events"

                  className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-5 py-2.5 text-sm font-extrabold text-brand-950 transition hover:-translate-y-0.5 hover:bg-lime-200"

                >

                  Browse events <ArrowRight size={15} />

                </Link>

                <Link

                  href="/create-event"

                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"

                >

                  <CalendarPlus size={15} /> Host an event

                </Link>

              </div>

            </div>

          </div>

        </Reveal>

      </div>

    </div>

  );

}