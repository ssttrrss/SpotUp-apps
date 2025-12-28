import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession } from "@/lib/auth";

// POST /api/auth/login - تسجيل الدخول
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
                { status: 400 }
            );
        }

        // البحث عن المستخدم
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "بيانات الدخول غير صحيحة" },
                { status: 401 }
            );
        }

        // التحقق من كلمة المرور
        if (!verifyPassword(password, user.password)) {
            return NextResponse.json(
                { success: false, error: "بيانات الدخول غير صحيحة" },
                { status: 401 }
            );
        }

        // إنشاء الجلسة
        await createSession(user.id);

        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء تسجيل الدخول" },
            { status: 500 }
        );
    }
}
