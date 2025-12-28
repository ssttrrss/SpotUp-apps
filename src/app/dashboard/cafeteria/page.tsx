"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Coffee, Loader2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";

interface Drink {
    id: number;
    name: string;
    price: number;
    isAvailable: boolean;
}

export default function CafeteriaPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
    const [formData, setFormData] = useState({ name: "", price: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDrinks();
    }, []);

    const fetchDrinks = async () => {
        try {
            const response = await fetch("/api/drinks");
            const data = await response.json();
            if (data.success) {
                setDrinks(data.data);
            }
        } catch {
            toast.error("فشل تحميل المشروبات");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editingDrink ? `/api/drinks/${editingDrink.id}` : "/api/drinks";
            const method = editingDrink ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(editingDrink ? "تم تعديل المشروب" : "تم إضافة المشروب");
                fetchDrinks();
                closeModal();
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("حدث خطأ");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا المشروب؟")) return;

        try {
            const response = await fetch(`/api/drinks/${id}`, { method: "DELETE" });
            const data = await response.json();

            if (data.success) {
                toast.success("تم حذف المشروب");
                fetchDrinks();
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("حدث خطأ");
        }
    };

    const toggleAvailability = async (drink: Drink) => {
        try {
            const response = await fetch(`/api/drinks/${drink.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isAvailable: !drink.isAvailable }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(drink.isAvailable ? "تم إيقاف المشروب" : "تم تفعيل المشروب");
                fetchDrinks();
            }
        } catch {
            toast.error("حدث خطأ");
        }
    };

    const openModal = (drink?: Drink) => {
        if (drink) {
            setEditingDrink(drink);
            setFormData({ name: drink.name, price: String(drink.price) });
        } else {
            setEditingDrink(null);
            setFormData({ name: "", price: "" });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingDrink(null);
        setFormData({ name: "", price: "" });
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
                    <h1 className="text-2xl font-bold">إدارة الكافيتيريا</h1>
                    <p className="text-[var(--text-secondary)]">
                        {drinks.length} مشروب مسجل
                    </p>
                </div>
                {isAdmin && (
                    <button onClick={() => openModal()} className="btn btn-primary">
                        <Plus className="w-5 h-5" />
                        إضافة مشروب
                    </button>
                )}
            </div>

            {/* Drinks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {drinks.map((drink) => (
                    <div
                        key={drink.id}
                        className={`card card-hover ${!drink.isAvailable ? "opacity-60" : ""}`}
                    >
                        <div className="flex items-start justify-between">
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${drink.isAvailable
                                        ? "bg-[var(--accent)]/20"
                                        : "bg-[var(--text-secondary)]/20"
                                    }`}
                            >
                                <Coffee
                                    className={`w-6 h-6 ${drink.isAvailable
                                            ? "text-[var(--accent)]"
                                            : "text-[var(--text-secondary)]"
                                        }`}
                                />
                            </div>
                            {isAdmin && (
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openModal(drink)}
                                        className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--primary)]"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(drink.id)}
                                        className="p-2 rounded-lg hover:bg-[var(--danger)]/10 text-[var(--text-secondary)] hover:text-[var(--danger)]"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-bold mt-4">{drink.name}</h3>
                        <p className="text-[var(--secondary)] font-medium text-xl mt-1">
                            {formatCurrency(drink.price)}
                        </p>

                        {isAdmin && (
                            <button
                                onClick={() => toggleAvailability(drink)}
                                className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-colors ${drink.isAvailable
                                        ? "bg-[var(--secondary)]/20 text-[var(--secondary)] hover:bg-[var(--secondary)]/30"
                                        : "bg-[var(--text-secondary)]/20 text-[var(--text-secondary)] hover:bg-[var(--text-secondary)]/30"
                                    }`}
                            >
                                {drink.isAvailable ? "متاح" : "غير متاح"}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {drinks.length === 0 && (
                <div className="text-center py-16">
                    <Coffee className="w-16 h-16 mx-auto text-[var(--text-secondary)] opacity-50 mb-4" />
                    <p className="text-[var(--text-secondary)]">لا توجد مشروبات مسجلة</p>
                    {isAdmin && (
                        <button
                            onClick={() => openModal()}
                            className="btn btn-primary mt-4"
                        >
                            <Plus className="w-5 h-5" />
                            إضافة أول مشروب
                        </button>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">
                            {editingDrink ? "تعديل المشروب" : "إضافة مشروب جديد"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    اسم المشروب
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="input"
                                    placeholder="مثال: قهوة عربية"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    السعر (ج.م)
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    className="input"
                                    placeholder="15"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : editingDrink ? (
                                        "حفظ التعديلات"
                                    ) : (
                                        "إضافة المشروب"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn btn-ghost"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
