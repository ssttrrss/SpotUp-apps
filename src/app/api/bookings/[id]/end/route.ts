import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// POST /api/bookings/[id]/end - إنهاء الحجز
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "غير مسجل الدخول" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // الحصول على الحجز مع الغرفة والمشروبات
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(id) },
            include: {
                room: true,
                drinkOrders: true,
            },
        });

        if (!booking) {
            return NextResponse.json(
                { success: false, error: "الحجز غير موجود" },
                { status: 404 }
            );
        }

        if (booking.status === "completed") {
            return NextResponse.json(
                { success: false, error: "الحجز منتهي بالفعل" },
                { status: 400 }
            );
        }

        // تحديد وقت الانتهاء
        const endTime = new Date();
        const startTime = new Date(booking.startTime);

        // حساب المدة بالدقائق
        const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

        // حساب تكلفة الغرفة
        const roomCost = (durationMinutes / 60) * booking.room.hourlyRate;

        // حساب تكلفة المشروبات
        const drinksCost = booking.drinkOrders.reduce(
            (sum, order) => sum + order.totalPrice,
            0
        );

        // المجموع الكلي
        const totalCost = roomCost + drinksCost;

        // تحديث الحجز
        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: {
                endTime,
                roomCost,
                drinksCost,
                totalCost,
                status: "completed",
            },
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
        });

        // تحرير الغرفة
        await prisma.room.update({
            where: { id: booking.roomId },
            data: { status: "available" },
        });

        return NextResponse.json({ success: true, data: updatedBooking });
    } catch (error) {
        console.error("End booking error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء إنهاء الحجز" },
            { status: 500 }
        );
    }
}
