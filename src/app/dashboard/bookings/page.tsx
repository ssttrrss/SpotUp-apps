"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    CalendarClock,
    Clock,
    CheckCircle,
    Loader2,
    DoorOpen,
    Users,
    Coffee,
} from "lucide-react";
import { formatCurrency, formatDateTime, formatTime } from "@/lib/utils";
import { toast } from "sonner";

interface Booking {
    id: number;
    type: string;
    startTime: string;
    endTime: string | null;
    roomCost: number;
    drinksCost: number;
    totalCost: number;
    status: string;
    room: { name: string };
    customer: { name: string };
    drinkOrders: { id: number; quantity: number; drink: { name: string } }[];
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`/api/bookings?status=${filter}`);
            const data = await response.json();
            if (data.success) {
                setBookings(data.data);
            }
        } catch {
            toast.error("فشل تحميل الحجوزات");
        } finally {
            setLoading(false);
        }
    };

    const endBooking = async (id: number) => {
        if (!confirm("هل أنت متأكد من إنهاء هذا الحجز؟")) return;

        try {
            const response = await fetch(`/api/bookings/${id}/end`, {
                method: "POST",
            });
            const data = await response.json();

            if (data.success) {
                toast.success(
                    `تم إنهاء الحجز - المجموع: ${formatCurrency(data.data.totalCost)}`
                );
                fetchBookings();
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("حدث خطأ");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">إدارة الحجوزات</h1>
                    <p className="text-[var(--text-secondary)]">
                        {bookings.length} حجز
                    </p>
                </div>
                <Link href="/dashboard/bookings/new" className="btn btn-primary">
                    <Plus className="w-5 h-5" />
                    حجز جديد
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-[var(--surface)] rounded-xl w-fit">
                {[
                    { value: "all", label: "الكل" },
                    { value: "active", label: "نشط" },
                    { value: "completed", label: "مكتمل" },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value as typeof filter)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === tab.value
                                ? "bg-[var(--primary)] text-white"
                                : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div key={booking.id} className="card">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${booking.status === "active"
                                            ? "bg-[var(--primary)]/20"
                                            : "bg-[var(--secondary)]/20"
                                        }`}
                                >
                                    {booking.status === "active" ? (
                                        <Clock
                                            className={`w-7 h-7 ${booking.status === "active"
                                                    ? "text-[var(--primary)]"
                                                    : "text-[var(--secondary)]"
                                                }`}
                                        />
                                    ) : (
                                        <CheckCircle className="w-7 h-7 text-[var(--secondary)]" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold">{booking.room.name}</h3>
                                        <span
                                            className={`badge ${booking.type === "fixed"
                                                    ? "badge-primary"
                                                    : "badge-warning"
                                                }`}
                                        >
                                            {booking.type === "fixed" ? "محدد" : "مفتوح"}
                                        </span>
                                        <span
                                            className={`badge ${booking.status === "active"
                                                    ? "badge-warning"
                                                    : "badge-success"
                                                }`}
                                        >
                                            {booking.status === "active" ? "نشط" : "مكتمل"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-[var(--text-secondary)]">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {booking.customer.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CalendarClock className="w-4 h-4" />
                                            {formatTime(booking.startTime)}
                                            {booking.endTime && ` - ${formatTime(booking.endTime)}`}
                                        </span>
                                        {booking.drinkOrders.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Coffee className="w-4 h-4" />
                                                {booking.drinkOrders.length} طلب
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-left">
                                <p className="text-2xl font-bold text-[var(--secondary)]">
                                    {formatCurrency(booking.totalCost)}
                                </p>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    غرفة: {formatCurrency(booking.roomCost)} | مشروبات:{" "}
                                    {formatCurrency(booking.drinksCost)}
                                </p>
                            </div>
                        </div>

                        {booking.status === "active" && (
                            <div className="flex gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                                <Link
                                    href={`/dashboard/bookings/${booking.id}`}
                                    className="btn btn-ghost flex-1"
                                >
                                    <Coffee className="w-4 h-4" />
                                    إضافة مشروبات
                                </Link>
                                <button
                                    onClick={() => endBooking(booking.id)}
                                    className="btn btn-secondary flex-1"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    إنهاء الحجز
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {bookings.length === 0 && (
                <div className="text-center py-16">
                    <CalendarClock className="w-16 h-16 mx-auto text-[var(--text-secondary)] opacity-50 mb-4" />
                    <p className="text-[var(--text-secondary)]">لا توجد حجوزات</p>
                    <Link href="/dashboard/bookings/new" className="btn btn-primary mt-4">
                        <Plus className="w-5 h-5" />
                        إنشاء أول حجز
                    </Link>
                </div>
            )}
        </div>
    );
}
