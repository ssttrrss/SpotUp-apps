import { cookies } from "next/headers";
import { prisma } from "./prisma";

// إنشاء جلسة بسيطة (في بيئة الإنتاج يجب استخدام JWT)
export async function createSession(userId: number) {
    const cookieStore = await cookies();
    cookieStore.set("session", String(userId), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // أسبوع
        path: "/",
    });
}

// الحصول على المستخدم الحالي من الجلسة
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
        return null;
    }

    const userId = parseInt(sessionCookie.value);

    if (isNaN(userId)) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        return user;
    } catch {
        return null;
    }
}

// التحقق من صلاحية الأدمن
export async function isAdmin() {
    const user = await getCurrentUser();
    return user?.role === "admin";
}

// تسجيل الخروج
export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

// تشفير كلمة المرور (بسيط للـ Demo - في الإنتاج استخدم bcrypt)
export function hashPassword(password: string): string {
    // في بيئة الإنتاج، استخدم bcrypt أو argon2
    return Buffer.from(password).toString("base64");
}

// التحقق من كلمة المرور
export function verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
}
