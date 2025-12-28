import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/rooms - جميع الغرف
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "غير مسجل الدخول" },
                { status: 401 }
            );
        }

        const rooms = await prisma.room.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: rooms });
    } catch (error) {
        console.error("Get rooms error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ" },
            { status: 500 }
        );
    }
}

// POST /api/rooms - إضافة غرفة جديدة
export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "غير مسجل الدخول" },
                { status: 401 }
            );
        }

        // فقط الأدمن يمكنه إضافة غرف
        if (!(await isAdmin())) {
            return NextResponse.json(
                { success: false, error: "غير مصرح لك بهذه العملية" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, hourlyRate } = body;

        if (!name || hourlyRate === undefined) {
            return NextResponse.json(
                { success: false, error: "اسم الغرفة وسعر الساعة مطلوبان" },
                { status: 400 }
            );
        }

        const room = await prisma.room.create({
            data: {
                name,
                hourlyRate: parseFloat(hourlyRate),
                status: "available",
            },
        });

        return NextResponse.json({ success: true, data: room }, { status: 201 });
    } catch (error) {
        console.error("Create room error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء إضافة الغرفة" },
            { status: 500 }
        );
    }
}
