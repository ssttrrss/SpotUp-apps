"use client";

import { useEffect, useState } from "react";
import { Plus, Users, Phone, FileText, Loader2, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface Customer {
    id: number;
    name: string;
    phone: string;
    notes: string | null;
    createdAt: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", phone: "", notes: "" });
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch("/api/customers");
            const data = await response.json();
            if (data.success) {
                setCustomers(data.data);
            }
        } catch {
            toast.error("فشل تحميل العملاء");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("تم إضافة العميل");
                fetchCustomers();
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

    const closeModal = () => {
        setShowModal(false);
        setFormData({ name: "", phone: "", notes: "" });
    };

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery)
    );

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
                    <h1 className="text-2xl font-bold">إدارة العملاء</h1>
                    <p className="text-[var(--text-secondary)]">
                        {customers.length} عميل مسجل
                    </p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <Plus className="w-5 h-5" />
                    إضافة عميل
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pr-12"
                    placeholder="بحث بالاسم أو رقم الهاتف..."
                />
            </div>

            {/* Customers Table */}
            <div className="card overflow-hidden p-0">
                <table className="table">
                    <thead>
                        <tr>
                            <th>العميل</th>
                            <th>رقم الهاتف</th>
                            <th>ملاحظات</th>
                            <th>تاريخ التسجيل</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-[var(--primary)]" />
                                        </div>
                                        <span className="font-medium">{customer.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                        <Phone className="w-4 h-4" />
                                        {customer.phone}
                                    </div>
                                </td>
                                <td>
                                    {customer.notes ? (
                                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                            <FileText className="w-4 h-4" />
                                            <span className="truncate max-w-[200px]">{customer.notes}</span>
                                        </div>
                                    ) : (
                                        <span className="text-[var(--text-secondary)]">-</span>
                                    )}
                                </td>
                                <td className="text-[var(--text-secondary)]">
                                    {formatDate(customer.createdAt)}
                                </td>
                                <td>
                                    <Link
                                        href={`/dashboard/customers/${customer.id}`}
                                        className="btn btn-ghost text-sm"
                                    >
                                        عرض السجل
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredCustomers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 mx-auto text-[var(--text-secondary)] opacity-50 mb-3" />
                        <p className="text-[var(--text-secondary)]">
                            {searchQuery ? "لا توجد نتائج" : "لا يوجد عملاء مسجلين"}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay\" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">إضافة عميل جديد</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    اسم العميل
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="input"
                                    placeholder="الاسم الكامل"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    رقم الهاتف
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="input"
                                    placeholder="01XXXXXXXXX"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    ملاحظات (اختياري)
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    className="input min-h-[100px] resize-none"
                                    placeholder="أي ملاحظات إضافية..."
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
                                    ) : (
                                        "إضافة العميل"
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
