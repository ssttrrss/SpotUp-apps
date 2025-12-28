import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/bookings - جميع الحجوزات
export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "غير مسجل الدخول" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status"); // active | completed | all

        const bookings = await prisma.booking.findMany({
            where: status && status !== "all" ? { status } : undefined,
            include: {
                room: true,
                customer: true,
                user: {
                    select: { id: true, name: true },
                },
                drinkOrders: {
                    include: { drink: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: bookings });
    } catch (error) {
        console.error("Get bookings error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ" },
            { status: 500 }
        );
    }
}

// POST /api/bookings - إنشاء حجز جديد
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
        const { roomId, customerId, type, startTime, endTime } = body;

        if (!roomId || !customerId || !type || !startTime) {
            return NextResponse.json(
                { success: false, error: "بيانات الحجز غير مكتملة" },
                { status: 400 }
            );
        }

        // التحقق من أن الغرفة متاحة
        const room = await prisma.room.findUnique({
            where: { id: parseInt(roomId) },
        });

        if (!room) {
            return NextResponse.json(
                { success: false, error: "الغرفة غير موجودة" },
                { status: 404 }
            );
        }

        if (room.status === "occupied") {
            return NextResponse.json(
                { success: false, error: "الغرفة مشغولة حاليًا" },
                { status: 400 }
            );
        }

        // حساب التكلفة للحجز المحدد
        let roomCost = 0;
        if (type === "fixed" && endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
            roomCost = (durationMinutes / 60) * room.hourlyRate;
        }

        // إنشاء الحجز
        const booking = await prisma.booking.create({
            data: {
                type,
                startTime: new Date(startTime),
                endTime: type === "fixed" && endTime ? new Date(endTime) : null,
                roomCost,
                totalCost: roomCost,
                status: "active",
                roomId: parseInt(roomId),
                customerId: parseInt(customerId),
                userId: user.id,
            },
            include: {
                room: true,
                customer: true,
                user: {
                    select: { id: true, name: true },
                },
            },
        });

        // تحديث حالة الغرفة
        await prisma.room.update({
            where: { id: parseInt(roomId) },
            data: { status: "occupied" },
        });

        return NextResponse.json({ success: true, data: booking }, { status: 201 });
    } catch (error) {
        console.error("Create booking error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء إنشاء الحجز" },
            { status: 500 }
        );
    }
}
