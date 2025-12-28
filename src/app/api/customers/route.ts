import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/customers - جميع العملاء
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "غير مسجل الدخول" },
                { status: 401 }
            );
        }

        const customers = await prisma.customer.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: customers });
    } catch (error) {
        console.error("Get customers error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ" },
            { status: 500 }
        );
    }
}

// POST /api/customers - إضافة عميل جديد
export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "غير مسجل الدخول" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, phone, notes } = body;

        if (!name || !phone) {
            return NextResponse.json(
                { success: false, error: "الاسم ورقم الهاتف مطلوبان" },
                { status: 400 }
            );
        }

        const customer = await prisma.customer.create({
            data: {
                name,
                phone,
                notes: notes || null,
            },
        });

        return NextResponse.json({ success: true, data: customer }, { status: 201 });
    } catch (error) {
        console.error("Create customer error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء إضافة العميل" },
            { status: 500 }
        );
    }
}
