"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    DoorOpen,
    CalendarClock,
    Users,
    Wallet,
    TrendingUp,
    Clock,
    Plus,
    ArrowLeft,
} from "lucide-react";
import { formatCurrency, formatTime } from "@/lib/utils";
import { toast } from "sonner";

interface Stats {
    activeBookings: number;
    availableRooms: number;
    occupiedRooms: number;
    todayIncome: number;
    totalCustomers: number;
}

interface ActiveBooking {
    id: number;
    startTime: string;
    room: { name: string; hourlyRate: number };
    customer: { name: string };
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [reportRes, bookingsRes] = await Promise.all([
                fetch("/api/reports/daily"),
                fetch("/api/bookings?status=active"),
            ]);

            const reportData = await reportRes.json();
            const bookingsData = await bookingsRes.json();

            if (reportData.success) {
                setStats(reportData.data.stats);
            }

            if (bookingsData.success) {
                setActiveBookings(bookingsData.data);
            }
        } catch {
            toast.error("فشل تحميل البيانات");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-[var(--surface)] rounded w-48"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-[var(--surface)] rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: "الحجوزات النشطة",
            value: stats?.activeBookings || 0,
            icon: CalendarClock,
            color: "var(--primary)",
            href: "/dashboard/bookings",
        },
        {
            label: "الغرف المتاحة",
            value: stats?.availableRooms || 0,
            icon: DoorOpen,
            color: "var(--secondary)",
            href: "/dashboard/rooms",
        },
        {
            label: "إجمالي العملاء",
            value: stats?.totalCustomers || 0,
            icon: Users,
            color: "var(--accent)",
            href: "/dashboard/customers",
        },
        {
            label: "دخل اليوم",
            value: formatCurrency(stats?.todayIncome || 0),
            icon: Wallet,
            color: "var(--primary)",
            href: "/dashboard/reports",
            isAmount: true,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">لوحة التحكم</h1>
                    <p className="text-[var(--text-secondary)]">مرحباً بك في نظام Let&apos;s Go</p>
                </div>
                <Link href="/dashboard/bookings/new" className="btn btn-primary">
                    <Plus className="w-5 h-5" />
                    حجز جديد
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="stat-card card-hover group"
                        >
                            <div className="flex items-center justify-between">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${stat.color}20` }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                                </div>
                                <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors" />
                            </div>
                            <div className="mt-4">
                                <p className={`stat-value ${stat.isAmount ? "text-[var(--secondary)]" : ""}`}>
                                    {stat.value}
                                </p>
                                <p className="stat-label">{stat.label}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Active Bookings & Room Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Bookings */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[var(--primary)]" />
                            الحجوزات النشطة
                        </h2>
                        <Link
                            href="/dashboard/bookings"
                            className="text-sm text-[var(--primary)] hover:underline"
                        >
                            عرض الكل
                        </Link>
                    </div>

                    {activeBookings.length === 0 ? (
                        <div className="text-center py-8 text-[var(--text-secondary)]">
                            <CalendarClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>لا توجد حجوزات نشطة</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeBookings.slice(0, 5).map((booking) => (
                                <Link
                                    key={booking.id}
                                    href={`/dashboard/bookings/${booking.id}`}
                                    className="flex items-center justify-between p-4 rounded-xl bg-[var(--background)] hover:bg-[var(--surface-hover)] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center">
                                            <DoorOpen className="w-5 h-5 text-[var(--primary)]" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{booking.room.name}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                {booking.customer.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            بدأ {formatTime(booking.startTime)}
                                        </p>
                                        <p className="text-sm text-[var(--secondary)]">
                                            {formatCurrency(booking.room.hourlyRate)}/ساعة
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Room Status */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[var(--secondary)]" />
                            حالة الغرف
                        </h2>
                        <Link
                            href="/dashboard/rooms"
                            className="text-sm text-[var(--primary)] hover:underline"
                        >
                            إدارة الغرف
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {/* Available */}
                        <div className="p-4 rounded-xl bg-[var(--secondary)]/10 border border-[var(--secondary)]/30">
                            <div className="flex items-center justify-between">
                                <span className="text-[var(--secondary)] font-medium">متاحة</span>
                                <span className="text-2xl font-bold text-[var(--secondary)]">
                                    {stats?.availableRooms || 0}
                                </span>
                            </div>
                            <div className="mt-2 h-2 bg-[var(--background)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--secondary)] rounded-full"
                                    style={{
                                        width: `${((stats?.availableRooms || 0) /
                                                ((stats?.availableRooms || 0) + (stats?.occupiedRooms || 0))) *
                                            100 || 0
                                            }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Occupied */}
                        <div className="p-4 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/30">
                            <div className="flex items-center justify-between">
                                <span className="text-[var(--danger)] font-medium">مشغولة</span>
                                <span className="text-2xl font-bold text-[var(--danger)]">
                                    {stats?.occupiedRooms || 0}
                                </span>
                            </div>
                            <div className="mt-2 h-2 bg-[var(--background)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--danger)] rounded-full"
                                    style={{
                                        width: `${((stats?.occupiedRooms || 0) /
                                                ((stats?.availableRooms || 0) + (stats?.occupiedRooms || 0))) *
                                            100 || 0
                                            }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
