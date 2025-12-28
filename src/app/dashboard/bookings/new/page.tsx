"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    DoorOpen,
    Users,
    Clock,
    CalendarClock,
    Loader2,
    Plus,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface Room {
    id: number;
    name: string;
    hourlyRate: number;
    status: string;
}

interface Customer {
    id: number;
    name: string;
    phone: string;
}

export default function NewBookingPage() {
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        roomId: "",
        customerId: "",
        type: "open" as "fixed" | "open",
        startTime: new Date().toISOString().slice(0, 16),
        endTime: "",
    });

    const [showNewCustomer, setShowNewCustomer] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
    const [savingCustomer, setSavingCustomer] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [roomsRes, customersRes] = await Promise.all([
                fetch("/api/rooms"),
                fetch("/api/customers"),
            ]);

            const roomsData = await roomsRes.json();
            const customersData = await customersRes.json();

            if (roomsData.success) {
                setRooms(roomsData.data.filter((r: Room) => r.status === "available"));
            }
            if (customersData.success) {
                setCustomers(customersData.data);
            }
        } catch {
            toast.error("فشل تحميل البيانات");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.roomId || !formData.customerId) {
            toast.error("يرجى اختيار الغرفة والعميل");
            return;
        }

        if (formData.type === "fixed" && !formData.endTime) {
            toast.error("يرجى تحديد وقت النهاية للحجز المحدد");
            return;
        }

        setSaving(true);

        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    startTime: new Date(formData.startTime).toISOString(),
                    endTime:
                        formData.type === "fixed" && formData.endTime
                            ? new Date(formData.endTime).toISOString()
                            : null,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("تم إنشاء الحجز بنجاح");
                router.push(`/dashboard/bookings/${data.data.id}`);
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("حدث خطأ");
        } finally {
            setSaving(false);
        }
    };

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingCustomer(true);

        try {
            const response = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCustomer),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("تم إضافة العميل");
                setCustomers([data.data, ...customers]);
                setFormData({ ...formData, customerId: String(data.data.id) });
                setShowNewCustomer(false);
                setNewCustomer({ name: "", phone: "" });
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("حدث خطأ");
        } finally {
            setSavingCustomer(false);
        }
    };

    const selectedRoom = rooms.find((r) => r.id === parseInt(formData.roomId));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg hover:bg-[var(--surface-hover)]"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">حجز جديد</h1>
                    <p className="text-[var(--text-secondary)]">إنشاء حجز جديد</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Room Selection */}
                <div className="card">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <DoorOpen className="w-5 h-5 text-[var(--primary)]" />
                        اختر الغرفة
                    </h2>

                    {rooms.length === 0 ? (
                        <div className="text-center py-4 text-[var(--text-secondary)]">
                            <p>لا توجد غرف متاحة حاليًا</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {rooms.map((room) => (
                                <button
                                    key={room.id}
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, roomId: String(room.id) })
                                    }
                                    className={`p-4 rounded-xl border-2 text-right transition-all ${formData.roomId === String(room.id)
                                            ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                            : "border-[var(--border)] hover:border-[var(--primary)]/50"
                                        }`}
                                >
                                    <p className="font-bold">{room.name}</p>
                                    <p className="text-[var(--secondary)]">
                                        {formatCurrency(room.hourlyRate)} / ساعة
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Customer Selection */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-[var(--secondary)]" />
                            اختر العميل
                        </h2>
                        <button
                            type="button"
                            onClick={() => setShowNewCustomer(!showNewCustomer)}
                            className="btn btn-ghost text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            عميل جديد
                        </button>
                    </div>

                    {showNewCustomer && (
                        <div className="mb-4 p-4 bg-[var(--background)] rounded-xl">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    value={newCustomer.name}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, name: e.target.value })
                                    }
                                    className="input"
                                    placeholder="اسم العميل"
                                />
                                <input
                                    type="tel"
                                    value={newCustomer.phone}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, phone: e.target.value })
                                    }
                                    className="input"
                                    placeholder="رقم الهاتف"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddCustomer}
                                className="btn btn-secondary w-full"
                                disabled={savingCustomer || !newCustomer.name || !newCustomer.phone}
                            >
                                {savingCustomer ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "إضافة وتحديد"
                                )}
                            </button>
                        </div>
                    )}

                    <select
                        value={formData.customerId}
                        onChange={(e) =>
                            setFormData({ ...formData, customerId: e.target.value })
                        }
                        className="input"
                        required
                    >
                        <option value="">اختر العميل...</option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name} - {customer.phone}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Booking Type */}
                <div className="card">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--accent)]" />
                        نوع الحجز
                    </h2>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "open" })}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${formData.type === "open"
                                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                                    : "border-[var(--border)] hover:border-[var(--accent)]/50"
                                }`}
                        >
                            <Clock className="w-6 h-6 mx-auto mb-2 text-[var(--accent)]" />
                            <p className="font-bold">حجز مفتوح</p>
                            <p className="text-sm text-[var(--text-secondary)]">
                                بدون وقت محدد
                            </p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "fixed" })}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${formData.type === "fixed"
                                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                                }`}
                        >
                            <CalendarClock className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]" />
                            <p className="font-bold">حجز محدد</p>
                            <p className="text-sm text-[var(--text-secondary)]">
                                وقت بداية ونهاية
                            </p>
                        </button>
                    </div>

                    <div className={`grid gap-3 ${formData.type === "fixed" ? "grid-cols-2" : "grid-cols-1"}`}>
                        <div>
                            <label className="block text-sm font-medium mb-2">وقت البداية</label>
                            <input
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={(e) =>
                                    setFormData({ ...formData, startTime: e.target.value })
                                }
                                className="input"
                                required
                            />
                        </div>
                        {formData.type === "fixed" && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    وقت النهاية
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={(e) =>
                                        setFormData({ ...formData, endTime: e.target.value })
                                    }
                                    className="input"
                                    required
                                    min={formData.startTime}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary */}
                {selectedRoom && (
                    <div className="card bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 border-[var(--primary)]/30">
                        <h3 className="font-bold mb-2">ملخص الحجز</h3>
                        <p className="text-[var(--text-secondary)]">
                            {selectedRoom.name} - {formatCurrency(selectedRoom.hourlyRate)} /
                            ساعة
                        </p>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    className="btn btn-primary w-full py-4 text-lg"
                    disabled={saving || !formData.roomId || !formData.customerId}
                >
                    {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <CalendarClock className="w-5 h-5" />
                            إنشاء الحجز
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
