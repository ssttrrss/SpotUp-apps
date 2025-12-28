"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Loader2, Coffee } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("تم تسجيل الدخول بنجاح");
                router.push("/dashboard");
            } else {
                toast.error(data.error || "فشل تسجيل الدخول");
            }
        } catch {
            toast.error("حدث خطأ في الاتصال");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] mb-4">
                        <Coffee className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                        Let&apos;s Go
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-2">نظام إدارة مساحات العمل</p>
                </div>

                {/* Login Form */}
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="admin@letsgo.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">كلمة المرور</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full py-3 text-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    تسجيل الدخول
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 pt-6 border-t border-[var(--border)]">
                        <p className="text-sm text-[var(--text-secondary)] text-center mb-3">بيانات تجريبية:</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-[var(--background)] rounded-lg p-3">
                                <p className="text-[var(--primary)] font-medium">أدمن</p>
                                <p className="text-[var(--text-secondary)]">admin@letsgo.com</p>
                                <p className="text-[var(--text-secondary)]">admin123</p>
                            </div>
                            <div className="bg-[var(--background)] rounded-lg p-3">
                                <p className="text-[var(--secondary)] font-medium">موظف</p>
                                <p className="text-[var(--text-secondary)]">employee@letsgo.com</p>
                                <p className="text-[var(--text-secondary)]">employee123</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
