"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowRight,
    DoorOpen,
    Users,
    Clock,
    Coffee,
    Trash2,
    Plus,
    CheckCircle,
    Loader2,
} from "lucide-react";
import {
    formatCurrency,
    formatDateTime,
    formatDuration,
    calculateDurationMinutes,
} from "@/lib/utils";
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
    room: { name: string; hourlyRate: number };
    customer: { name: string; phone: string };
    drinkOrders: {
        id: number;
        quantity: number;
        totalPrice: number;
        drink: { name: string; price: number };
    }[];
}

interface Drink {
    id: number;
    name: string;
    price: number;
    isAvailable: boolean;
}

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDrinkModal, setShowDrinkModal] = useState(false);
    const [selectedDrink, setSelectedDrink] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [addingDrink, setAddingDrink] = useState(false);
    const [ending, setEnding] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bookingRes, drinksRes] = await Promise.all([
                fetch(`/api/bookings/${params.id}`),
                fetch("/api/drinks"),
            ]);

            const bookingData = await bookingRes.json();
            const drinksData = await drinksRes.json();

            if (bookingData.success) {
                setBooking(bookingData.data);
            } else {
                toast.error("الحجز غير موجود");
                router.push("/dashboard/bookings");
            }

            if (drinksData.success) {
                setDrinks(drinksData.data.filter((d: Drink) => d.isAvailable));
            }
        } catch {
            toast.error("فشل تحميل البيانات");
        } finally {
            setLoading(false);
        }
    };

    const addDrinkOrder = async () => {
        if (!selectedDrink || !quantity) return;

        setAddingDrink(true);
        try {
            const response = await fetch(`/api/bookings/${params.id}/drinks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    drinkId: selectedDrink,
                    quantity: parseInt(quantity),
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("تم إضافة المشروب");
                fetchData();
                setShowDrinkModal(false);
                setSelectedDrink("");
                setQuantity("1");
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("حدث خطأ");
        } finally {
            setAddingDrink(false);
        }
    };

    const removeDrinkOrder = async (orderId: number) => {
        try {
            const response = await fetch(`/api/drink-orders/${orderId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                toast.success("تم حذف الطلب");
                fetchData();
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("حدث خطأ");
        }
    };

    const endBooking = async () => {
        if (!confirm("هل أنت متأكد من إنهاء هذا الحجز؟")) return;

        setEnding(true);
        try {
            const response = await fetch(`/api/bookings/${params.id}/end`, {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                toast.success(
                    `تم إنهاء الحجز - المجموع: ${formatCurrency(data.data.totalCost)}`
                );
                setBooking(data.data);
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("حدث خطأ");
        } finally {
            setEnding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    if (!booking) return null;

    const currentDuration =
        booking.status === "active"
            ? calculateDurationMinutes(booking.startTime, new Date().toISOString())
            : booking.endTime
                ? calculateDurationMinutes(booking.startTime, booking.endTime)
                : 0;

    const estimatedRoomCost =
        booking.status === "active"
            ? (currentDuration / 60) * booking.room.hourlyRate
            : booking.roomCost;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-[var(--surface-hover)]"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">تفاصيل الحجز #{booking.id}</h1>
                        <p className="text-[var(--text-secondary)]">
                            {booking.room.name} - {booking.customer.name}
                        </p>
                    </div>
                </div>

                <span
                    className={`badge text-lg ${booking.status === "active" ? "badge-warning" : "badge-success"
                        }`}
                >
                    {booking.status === "active" ? "نشط" : "مكتمل"}
                </span>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">
                            <DoorOpen className="w-6 h-6 text-[var(--primary)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)]">الغرفة</p>
                            <p className="font-bold">{booking.room.name}</p>
                            <p className="text-sm text-[var(--secondary)]">
                                {formatCurrency(booking.room.hourlyRate)}/ساعة
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[var(--secondary)]/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-[var(--secondary)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)]">العميل</p>
                            <p className="font-bold">{booking.customer.name}</p>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {booking.customer.phone}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-[var(--accent)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)]">المدة</p>
                            <p className="font-bold">{formatDuration(currentDuration)}</p>
                            <p className="text-sm text-[var(--text-secondary)]">
                                بدأ {formatDateTime(booking.startTime)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Drink Orders */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-[var(--accent)]" />
                        طلبات المشروبات ({booking.drinkOrders.length})
                    </h2>
                    {booking.status === "active" && (
                        <button
                            onClick={() => setShowDrinkModal(true)}
                            className="btn btn-primary text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            إضافة مشروب
                        </button>
                    )}
                </div>

                {booking.drinkOrders.length === 0 ? (
                    <div className="text-center py-8 text-[var(--text-secondary)]">
                        <Coffee className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>لا توجد طلبات مشروبات</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {booking.drinkOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-[var(--background)]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center">
                                        <Coffee className="w-5 h-5 text-[var(--accent)]" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{order.drink.name}</p>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            {order.quantity} × {formatCurrency(order.drink.price)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-[var(--secondary)]">
                                        {formatCurrency(order.totalPrice)}
                                    </span>
                                    {booking.status === "active" && (
                                        <button
                                            onClick={() => removeDrinkOrder(order.id)}
                                            className="p-2 rounded-lg hover:bg-[var(--danger)]/10 text-[var(--text-secondary)] hover:text-[var(--danger)]"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cost Summary */}
            <div className="card bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10">
                <h2 className="text-lg font-bold mb-4">ملخص الحساب</h2>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">
                            تكلفة الغرفة ({formatDuration(currentDuration)})
                        </span>
                        <span className="font-medium">
                            {formatCurrency(estimatedRoomCost)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">تكلفة المشروبات</span>
                        <span className="font-medium">
                            {formatCurrency(booking.drinksCost)}
                        </span>
                    </div>
                    <hr className="border-[var(--border)]" />
                    <div className="flex justify-between text-xl">
                        <span className="font-bold">المجموع الكلي</span>
                        <span className="font-bold text-[var(--secondary)]">
                            {formatCurrency(
                                booking.status === "active"
                                    ? estimatedRoomCost + booking.drinksCost
                                    : booking.totalCost
                            )}
                        </span>
                    </div>
                    {booking.status === "active" && (
                        <p className="text-xs text-[var(--text-secondary)] text-center">
                            * التكلفة تقديرية وسيتم حسابها بدقة عند إنهاء الحجز
                        </p>
                    )}
                </div>
            </div>

            {/* End Booking Button */}
            {booking.status === "active" && (
                <button
                    onClick={endBooking}
                    className="btn btn-secondary w-full py-4 text-lg"
                    disabled={ending}
                >
                    {ending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            إنهاء الحجز
                        </>
                    )}
                </button>
            )}

            {/* Add Drink Modal */}
            {showDrinkModal && (
                <div className="modal-overlay" onClick={() => setShowDrinkModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">إضافة مشروب</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    اختر المشروب
                                </label>
                                <select
                                    value={selectedDrink}
                                    onChange={(e) => setSelectedDrink(e.target.value)}
                                    className="input"
                                >
                                    <option value="">اختر...</option>
                                    {drinks.map((drink) => (
                                        <option key={drink.id} value={drink.id}>
                                            {drink.name} - {formatCurrency(drink.price)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">الكمية</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="input"
                                    min="1"
                                    max="99"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={addDrinkOrder}
                                    className="btn btn-primary flex-1"
                                    disabled={addingDrink || !selectedDrink}
                                >
                                    {addingDrink ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        "إضافة"
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowDrinkModal(false)}
                                    className="btn btn-ghost"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
