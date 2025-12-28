import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/drinks - جميع المشروبات
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "غير مسجل الدخول" },
                { status: 401 }
            );
        }

        const drinks = await prisma.drink.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: drinks });
    } catch (error) {
        console.error("Get drinks error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ" },
            { status: 500 }
        );
    }
}

// POST /api/drinks - إضافة مشروب جديد
export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "غير مسجل الدخول" },
                { status: 401 }
            );
        }

        if (!(await isAdmin())) {
            return NextResponse.json(
                { success: false, error: "غير مصرح لك بهذه العملية" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, price } = body;

        if (!name || price === undefined) {
            return NextResponse.json(
                { success: false, error: "اسم المشروب والسعر مطلوبان" },
                { status: 400 }
            );
        }

        const drink = await prisma.drink.create({
            data: {
                name,
                price: parseFloat(price),
                isAvailable: true,
            },
        });

        return NextResponse.json({ success: true, data: drink }, { status: 201 });
    } catch (error) {
        console.error("Create drink error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء إضافة المشروب" },
            { status: 500 }
        );
    }
}
