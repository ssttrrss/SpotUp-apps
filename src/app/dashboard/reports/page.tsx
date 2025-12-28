"use client";

import { useEffect, useState } from "react";
import {
    BarChart3,
    CalendarClock,
    DoorOpen,
    Wallet,
    TrendingUp,
    Loader2,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

interface DailyReport {
    stats: {
        activeBookings: number;
        availableRooms: number;
        occupiedRooms: number;
        todayIncome: number;
        totalCustomers: number;
    };
    todayBookings: {
        id: number;
        startTime: string;
        endTime: string;
        totalCost: number;
        room: { name: string };
        customer: { name: string };
    }[];
}

export default function ReportsPage() {
    const [report, setReport] = useState<DailyReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const response = await fetch("/api/reports/daily");
            const data = await response.json();
            if (data.success) {
                setReport(data.data);
            }
        } catch {
            toast.error("فشل تحميل التقرير");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">التقارير</h1>
                <p className="text-[var(--text-secondary)]">
                    تقرير اليوم -{" "}
                    {new Date().toLocaleDateString("ar-EG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[var(--secondary)]/20 flex items-center justify-center">
                            <Wallet className="w-7 h-7 text-[var(--secondary)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)]">دخل اليوم</p>
                            <p className="text-2xl font-bold text-[var(--secondary)]">
                                {formatCurrency(report.stats.todayIncome)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">
                            <CalendarClock className="w-7 h-7 text-[var(--primary)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)]">
                                حجوزات اليوم المكتملة
                            </p>
                            <p className="text-2xl font-bold">
                                {report.todayBookings.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
                            <DoorOpen className="w-7 h-7 text-[var(--accent)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)]">الحجوزات النشطة</p>
                            <p className="text-2xl font-bold">{report.stats.activeBookings}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[var(--danger)]/20 flex items-center justify-center">
                            <TrendingUp className="w-7 h-7 text-[var(--danger)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)]">الغرف المشغولة</p>
                            <p className="text-2xl font-bold">{report.stats.occupiedRooms}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Completed Bookings */}
            <div className="card">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
                    حجوزات اليوم المكتملة
                </h2>

                {report.todayBookings.length === 0 ? (
                    <div className="text-center py-12 text-[var(--text-secondary)]">
                        <CalendarClock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>لا توجد حجوزات مكتملة اليوم</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>الغرفة</th>
                                    <th>العميل</th>
                                    <th>وقت البداية</th>
                                    <th>وقت النهاية</th>
                                    <th>المجموع</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.todayBookings.map((booking, index) => (
                                    <tr key={booking.id}>
                                        <td className="text-[var(--text-secondary)]">{index + 1}</td>
                                        <td className="font-medium">{booking.room.name}</td>
                                        <td>{booking.customer.name}</td>
                                        <td className="text-[var(--text-secondary)]">
                                            {formatDateTime(booking.startTime)}
                                        </td>
                                        <td className="text-[var(--text-secondary)]">
                                            {formatDateTime(booking.endTime)}
                                        </td>
                                        <td className="font-bold text-[var(--secondary)]">
                                            {formatCurrency(booking.totalCost)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-[var(--primary)]">
                                    <td colSpan={5} className="font-bold text-lg">
                                        إجمالي اليوم
                                    </td>
                                    <td className="font-bold text-lg text-[var(--secondary)]">
                                        {formatCurrency(report.stats.todayIncome)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
