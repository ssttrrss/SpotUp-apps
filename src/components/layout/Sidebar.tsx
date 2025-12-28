"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
    LayoutDashboard,
    DoorOpen,
    CalendarClock,
    Users,
    Coffee,
    BarChart3,
    LogOut,
    ChevronLeft,
    Shield,
    User,
} from "lucide-react";

const navigation = [
    { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
    { name: "الحجوزات", href: "/dashboard/bookings", icon: CalendarClock },
    { name: "الغرف", href: "/dashboard/rooms", icon: DoorOpen },
    { name: "العملاء", href: "/dashboard/customers", icon: Users },
    { name: "الكافيتيريا", href: "/dashboard/cafeteria", icon: Coffee },
    { name: "التقارير", href: "/dashboard/reports", icon: BarChart3 },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside className="fixed right-0 top-0 h-screen w-64 bg-[var(--surface)] border-l border-[var(--border)] flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                        <Coffee className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Let&apos;s Go</h1>
                        <p className="text-xs text-[var(--text-secondary)]">إدارة Workspace</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-[var(--primary)] text-white"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                            {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User info & Logout */}
            <div className="p-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user?.role === "admin"
                            ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                            : "bg-[var(--secondary)]/20 text-[var(--secondary)]"
                        }`}>
                        {user?.role === "admin" ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">
                            {user?.role === "admin" ? "مدير النظام" : "موظف"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
}
