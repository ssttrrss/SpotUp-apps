import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// DELETE /api/drink-orders/[id] - حذف طلب مشروب
export async function DELETE(
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

        // الحصول على طلب المشروب
        const drinkOrder = await prisma.drinkOrder.findUnique({
            where: { id: parseInt(id) },
            include: { booking: true },
        });

        if (!drinkOrder) {
            return NextResponse.json(
                { success: false, error: "الطلب غير موجود" },
                { status: 404 }
            );
        }

        if (drinkOrder.booking.status === "completed") {
            return NextResponse.json(
                { success: false, error: "لا يمكن تعديل حجز منتهي" },
                { status: 400 }
            );
        }

        // حذف الطلب
        await prisma.drinkOrder.delete({
            where: { id: parseInt(id) },
        });

        // تحديث إجمالي المشروبات في الحجز
        const allDrinkOrders = await prisma.drinkOrder.findMany({
            where: { bookingId: drinkOrder.bookingId },
        });

        const drinksCost = allDrinkOrders.reduce(
            (sum, order) => sum + order.totalPrice,
            0
        );

        await prisma.booking.update({
            where: { id: drinkOrder.bookingId },
            data: {
                drinksCost,
                totalCost: drinkOrder.booking.roomCost + drinksCost,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete drink order error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء حذف الطلب" },
            { status: 500 }
        );
    }
}
