
import Link from "next/link";
import { HeartHandshake } from "lucide-react";

function XLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const Footer = () => {
  return (
    <footer
      className="relative mt-20 overflow-hidden bg-brand-950 text-brand-100"
      style={{
        backgroundImage: "url('/footer.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-brand-950/30 pointer-events-none" />

      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-lime-400/60 to-transparent" />

      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300 text-brand-950">
              <HeartHandshake size={20} />
            </span>

            <span className="text-lg font-extrabold tracking-tight text-white">
              Together<span className="text-lime-300">WeCan</span>
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-brand-200/80">
            Local actions, global impact. Join community service events near you and be part of
            something bigger.
          </p>

          <div className="mt-5 flex gap-3">
            {[FacebookLogo, XLogo, InstagramLogo, YoutubeLogo].map((Icon, index) => (
              <a
                key={index}
                href="#"
                aria-label="Social link"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-900/80 text-brand-200 transition hover:-translate-y-0.5 hover:bg-lime-300 hover:text-brand-950"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            Quick Links
          </h4>

          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/events", label: "Upcoming Events" },
              { href: "/dashboard", label: "Dashboard" },
              { href: "/saved-events", label: "Saved Events" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-brand-200/80 transition hover:text-lime-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            Get Involved
          </h4>

          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { href: "/create-event", label: "Host an Event" },
              { href: "/joined-events", label: "Joined Events" },
              { href: "/manage-events", label: "Manage Events" },
              { href: "/profile", label: "Your Profile" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-brand-200/80 transition hover:text-lime-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            Make a difference
          </h4>

          <p className="mt-4 text-sm leading-relaxed text-brand-200/80">
            It takes only one small act of kindness to start something bigger.
          </p>

          <Link
            href="/events"
            className="mt-5 inline-flex rounded-full bg-lime-300 px-6 py-2.5 text-sm font-extrabold text-brand-950 transition hover:-translate-y-0.5 hover:bg-lime-200"
          >
            Join an Event
          </Link>
        </div>
      </div>

      <div className="relative border-t border-brand-900 py-5 text-center text-xs text-brand-300/70">
        © {new Date().getFullYear()} TogetherWeCan — Built with care for the community.
      </div>
    </footer>
  );
};

export default Footer;
