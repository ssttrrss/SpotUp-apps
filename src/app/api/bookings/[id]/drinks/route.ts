import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// POST /api/bookings/[id]/drinks - إضافة مشروب للحجز
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
        const body = await request.json();
        const { drinkId, quantity } = body;

        if (!drinkId || !quantity) {
            return NextResponse.json(
                { success: false, error: "المشروب والكمية مطلوبان" },
                { status: 400 }
            );
        }

        // التحقق من الحجز
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(id) },
        });

        if (!booking) {
            return NextResponse.json(
                { success: false, error: "الحجز غير موجود" },
                { status: 404 }
            );
        }

        if (booking.status === "completed") {
            return NextResponse.json(
                { success: false, error: "لا يمكن إضافة مشروبات لحجز منتهي" },
                { status: 400 }
            );
        }

        // الحصول على سعر المشروب
        const drink = await prisma.drink.findUnique({
            where: { id: parseInt(drinkId) },
        });

        if (!drink) {
            return NextResponse.json(
                { success: false, error: "المشروب غير موجود" },
                { status: 404 }
            );
        }

        // حساب السعر الإجمالي
        const totalPrice = drink.price * parseInt(quantity);

        // إنشاء طلب المشروب
        const drinkOrder = await prisma.drinkOrder.create({
            data: {
                quantity: parseInt(quantity),
                totalPrice,
                bookingId: parseInt(id),
                drinkId: parseInt(drinkId),
            },
            include: { drink: true },
        });

        // تحديث إجمالي المشروبات في الحجز
        const allDrinkOrders = await prisma.drinkOrder.findMany({
            where: { bookingId: parseInt(id) },
        });

        const drinksCost = allDrinkOrders.reduce(
            (sum, order) => sum + order.totalPrice,
            0
        );

        await prisma.booking.update({
            where: { id: parseInt(id) },
            data: {
                drinksCost,
                totalCost: booking.roomCost + drinksCost,
            },
        });

        return NextResponse.json({ success: true, data: drinkOrder }, { status: 201 });
    } catch (error) {
        console.error("Add drink order error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء إضافة المشروب" },
            { status: 500 }
        );
    }
}
