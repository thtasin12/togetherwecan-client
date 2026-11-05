import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get in Touch — TogetherWeCan",
  description:
    "Have a question, a partnership idea, or just want to say hello? Reach out to the TogetherWeCan community team — we read every message and reply within 1–2 business days.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
