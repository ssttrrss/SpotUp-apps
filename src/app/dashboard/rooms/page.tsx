"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, DoorOpen, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";

interface Room {
    id: number;
    name: string;
    hourlyRate: number;
    status: string;
}

export default function RoomsPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [formData, setFormData] = useState({ name: "", hourlyRate: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await fetch("/api/rooms");
            const data = await response.json();
            if (data.success) {
                setRooms(data.data);
            }
        } catch {
            toast.error("فشل تحميل الغرف");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editingRoom ? `/api/rooms/${editingRoom.id}` : "/api/rooms";
            const method = editingRoom ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(editingRoom ? "تم تعديل الغرفة" : "تم إضافة الغرفة");
                fetchRooms();
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
        if (!confirm("هل أنت متأكد من حذف هذه الغرفة؟")) return;

        try {
            const response = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
            const data = await response.json();

            if (data.success) {
                toast.success("تم حذف الغرفة");
                fetchRooms();
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("حدث خطأ");
        }
    };

    const openModal = (room?: Room) => {
        if (room) {
            setEditingRoom(room);
            setFormData({ name: room.name, hourlyRate: String(room.hourlyRate) });
        } else {
            setEditingRoom(null);
            setFormData({ name: "", hourlyRate: "" });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingRoom(null);
        setFormData({ name: "", hourlyRate: "" });
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
                    <h1 className="text-2xl font-bold">إدارة الغرف</h1>
                    <p className="text-[var(--text-secondary)]">
                        {rooms.length} غرفة مسجلة
                    </p>
                </div>
                {isAdmin && (
                    <button onClick={() => openModal()} className="btn btn-primary">
                        <Plus className="w-5 h-5" />
                        إضافة غرفة
                    </button>
                )}
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.id} className="card card-hover">
                        <div className="flex items-start justify-between">
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${room.status === "available"
                                        ? "bg-[var(--secondary)]/20"
                                        : "bg-[var(--danger)]/20"
                                    }`}
                            >
                                <DoorOpen
                                    className={`w-6 h-6 ${room.status === "available"
                                            ? "text-[var(--secondary)]"
                                            : "text-[var(--danger)]"
                                        }`}
                                />
                            </div>
                            {isAdmin && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(room)}
                                        className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--primary)]"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(room.id)}
                                        className="p-2 rounded-lg hover:bg-[var(--danger)]/10 text-[var(--text-secondary)] hover:text-[var(--danger)]"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-bold mt-4">{room.name}</h3>
                        <p className="text-[var(--primary)] font-medium mt-1">
                            {formatCurrency(room.hourlyRate)} / ساعة
                        </p>

                        <div className="mt-4">
                            <span
                                className={`badge ${room.status === "available" ? "badge-success" : "badge-danger"
                                    }`}
                            >
                                {room.status === "available" ? "متاحة" : "مشغولة"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {rooms.length === 0 && (
                <div className="text-center py-16">
                    <DoorOpen className="w-16 h-16 mx-auto text-[var(--text-secondary)] opacity-50 mb-4" />
                    <p className="text-[var(--text-secondary)]">لا توجد غرف مسجلة</p>
                    {isAdmin && (
                        <button
                            onClick={() => openModal()}
                            className="btn btn-primary mt-4"
                        >
                            <Plus className="w-5 h-5" />
                            إضافة أول غرفة
                        </button>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">
                            {editingRoom ? "تعديل الغرفة" : "إضافة غرفة جديدة"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    اسم الغرفة
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="input"
                                    placeholder="مثال: غرفة الاجتماعات"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    سعر الساعة (ج.م)
                                </label>
                                <input
                                    type="number"
                                    value={formData.hourlyRate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, hourlyRate: e.target.value })
                                    }
                                    className="input"
                                    placeholder="100"
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
                                    ) : editingRoom ? (
                                        "حفظ التعديلات"
                                    ) : (
                                        "إضافة الغرفة"
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
