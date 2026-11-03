"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CalendarCheck2, ChevronDown, Heart, LayoutDashboard, LogOut, Menu, PlusCircle, Settings2, UserRound, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { initials } from "@/lib/format";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { toast } from "sonner";

const links = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Upcoming Events" },
    { href: "/#features", label: "About" },
    { href: "/contact", label: "Contact" }
]

const accountLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/create-event", icon: PlusCircle, label: "Create Event" },
    { href: "/manage-events", icon: Settings2, label: "Manage Events" },
    { href: "/joined-events", icon: CalendarCheck2, label: "Joined Events" },
    { href: "/saved-events", icon: Heart, label: "Saved Events" },
    { href: "/profile", icon: UserRound, label: "Profile" }
]

function isActive(pathname: string, href: string) {
    if (href.startsWith("/#")) {
        return false
    }
    if (href === "/") {
        return pathname === "/"
    }

    return pathname === href || pathname.startsWith(`${href}/`)
}

function Avatar({ name, photoURL, size = 34 }: { name: string; photoURL?: string; size?: number }) {
    if (photoURL) {
        return (
            <img
                src={photoURL}
                alt={name}
                style={{ width: size, height: size }}
                className="rounded-full object-cover"
            />
        )
    }

    return (
        <span
            style={{ width: size, height: size }}
            className="inline-flex items-center justify-center rounded-full bg-brand-600 text-[11px] font-extrabold text-white"
        >
            {initials(name)}
        </span>
    )
}

const Navbar = () => {
    const { user, loading, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMobileOpen(false)
        setMenuOpen(false)
    }, [pathname])

    useEffect(() => {
        if (!menuOpen) return
        const onPointerDown = (event: MouseEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false)
        }
        document.addEventListener("mousedown", onPointerDown)
        document.addEventListener("keydown", onKeyDown)

        return () => {
            document.removeEventListener("mousedown", onPointerDown)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [menuOpen])

    const handleLogout = async () => {
        try {
            await logout()
            toast.success("Logged out successfully")
            router.push("/")
        } catch {
            toast.error("Logout failed. Try again.")
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/75 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/75">
            <nav className="mx-auto h-16 max-w-7xl justify-between flex items-center px-4 sm:px-6">
                <Logo />

                <div className="gap-1 md:flex items-center hidden">
                    {links.map((link) => {
                        const active = isActive(pathname, link.href)
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                    active
                                        ? "bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300"
                                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="hidden items-center gap-2.5 md:flex">
                    <ThemeToggle />
                    {loading ? (
                        <div className="h-9 w-28 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                    ) : user ? (
                        <>
                            <Link
                                href="/create-event"
                                className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
                            >
                                <PlusCircle size={15} /> Host
                            </Link>

                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((open) => !open)}
                                    aria-haspopup="menu"
                                    aria-expanded={menuOpen}
                                    className="items-center gap-1.5 rounded-full flex border border-neutral-200 bg-white py-1 pl-1 pr-2.5 cursor-pointer transition hover:border-brand-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-brand-700"
                                >
                                    <Avatar name={user.name} photoURL={user.photoURL} />
                                    <ChevronDown
                                        size={14}
                                        className={`text-neutral-500 transition ${menuOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {menuOpen && (
                                    <div
                                        role="menu"
                                        className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
                                    >
                                        <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
                                            <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div className="py-1.5">
                                            {accountLinks.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    role="menuitem"
                                                    className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                                >
                                                    <item.icon size={15} className="text-brand-600 dark:text-brand-400" />
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full gap-2.5 items-center flex border-t border-neutral-100 px-4 py-2.5 text-sm font-semibold text-rose-600 cursor-pointer transition hover:bg-rose-50 dark:border-neutral-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                        >
                                            <LogOut size={15} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full bg-brand-600 text-white shadow-sm py-2 px-5 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
                            >
                                Join free
                            </Link>
                        </>
                    )}
                </div>

                <div className="items-center gap-2 flex md:hidden">
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setMobileOpen((open) => !open)}
                        aria-label="Menu"
                        aria-expanded={mobileOpen}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white cursor-pointer dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div className="border-t border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950 md:hidden">
                    <div className="flex-col gap-1 flex">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="my-2 h-px bg-neutral-200 dark:bg-neutral-800" />

                    {loading ? null : user ? (
                        <>
                            <div className="mb-2 flex items-center gap-3 rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-900">
                                <Avatar name={user.name} photoURL={user.photoURL} size={38} />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">{user.name}</p>
                                    <p className="truncate text-xs text-neutral-500">{user.email}</p>
                                </div>
                            </div>
                            {accountLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
                                >
                                    <item.icon size={16} className="text-brand-600 dark:text-brand-400" />
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-1 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-600 cursor-pointer dark:bg-rose-950/30 dark:text-rose-400 w-full"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <Link
                                href="/login"
                                className="rounded-full border border-neutral-200 px-5 py-2.5 text-center text-sm font-bold text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full bg-brand-600 px-5 py-2.5 text-center text-sm font-bold text-white"
                            >
                                Join free
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}

export default Navbar