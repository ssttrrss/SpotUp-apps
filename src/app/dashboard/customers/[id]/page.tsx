"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowRight,
    Users,
    Phone,
    FileText,
    CalendarClock,
    Loader2,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

interface CustomerDetail {
    id: number;
    name: string;
    phone: string;
    notes: string | null;
    bookings: {
        id: number;
        startTime: string;
        endTime: string | null;
        totalCost: number;
        status: string;
        room: { name: string };
    }[];
}

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [customer, setCustomer] = useState<CustomerDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomer();
    }, []);

    const fetchCustomer = async () => {
        try {
            const response = await fetch(`/api/customers/${params.id}`);
            const data = await response.json();
            if (data.success) {
                setCustomer(data.data);
            } else {
                toast.error("العميل غير موجود");
                router.push("/dashboard/customers");
            }
        } catch {
            toast.error("فشل تحميل بيانات العميل");
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

    if (!customer) return null;

    const totalSpent = customer.bookings
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + b.totalCost, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg hover:bg-[var(--surface-hover)]"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">{customer.name}</h1>
                    <p className="text-[var(--text-secondary)]">تفاصيل العميل</p>
                </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-[var(--primary)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)]">الاسم</p>
                            <p className="font-medium">{customer.name}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[var(--secondary)]/20 flex items-center justify-center">
                            <Phone className="w-6 h-6 text-[var(--secondary)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)]">الهاتف</p>
                            <p className="font-medium">{customer.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[var(--accent)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)]">إجمالي الإنفاق</p>
                            <p className="font-medium text-[var(--secondary)]">
                                {formatCurrency(totalSpent)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {customer.notes && (
                <div className="card">
                    <h3 className="text-sm text-[var(--text-secondary)] mb-2">ملاحظات</h3>
                    <p>{customer.notes}</p>
                </div>
            )}

            {/* Booking History */}
            <div className="card">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <CalendarClock className="w-5 h-5 text-[var(--primary)]" />
                    سجل الحجوزات ({customer.bookings.length})
                </h2>

                {customer.bookings.length === 0 ? (
                    <div className="text-center py-8 text-[var(--text-secondary)]">
                        <CalendarClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>لا توجد حجوزات سابقة</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {customer.bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-[var(--background)]"
                            >
                                <div>
                                    <p className="font-medium">{booking.room.name}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        {formatDateTime(booking.startTime)}
                                    </p>
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-[var(--secondary)]">
                                        {formatCurrency(booking.totalCost)}
                                    </p>
                                    <span
                                        className={`badge text-xs ${booking.status === "completed"
                                                ? "badge-success"
                                                : "badge-warning"
                                            }`}
                                    >
                                        {booking.status === "completed" ? "مكتمل" : "نشط"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
