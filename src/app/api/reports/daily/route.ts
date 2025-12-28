import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/reports/daily - تقرير اليوم
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "غير مسجل الدخول" },
                { status: 401 }
            );
        }

        // بداية ونهاية اليوم
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // إحصائيات الغرف
        const [availableRooms, occupiedRooms] = await Promise.all([
            prisma.room.count({ where: { status: "available" } }),
            prisma.room.count({ where: { status: "occupied" } }),
        ]);

        // الحجوزات النشطة
        const activeBookings = await prisma.booking.count({
            where: { status: "active" },
        });

        // حجوزات اليوم المكتملة
        const todayCompletedBookings = await prisma.booking.findMany({
            where: {
                status: "completed",
                endTime: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            include: {
                room: true,
                customer: true,
            },
        });

        // إجمالي دخل اليوم
        const todayIncome = todayCompletedBookings.reduce(
            (sum, booking) => sum + booking.totalCost,
            0
        );

        // إجمالي العملاء
        const totalCustomers = await prisma.customer.count();

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    activeBookings,
                    availableRooms,
                    occupiedRooms,
                    todayIncome,
                    totalCustomers,
                },
                todayBookings: todayCompletedBookings,
            },
        });
    } catch (error) {
        console.error("Get daily report error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ" },
            { status: 500 }
        );
    }
}
