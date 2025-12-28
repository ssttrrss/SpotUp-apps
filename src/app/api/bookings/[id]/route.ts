import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/bookings/[id] - حجز واحد
export async function GET(
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
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(id) },
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

        if (!booking) {
            return NextResponse.json(
                { success: false, error: "الحجز غير موجود" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: booking });
    } catch (error) {
        console.error("Get booking error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ" },
            { status: 500 }
        );
    }
}

// PUT /api/bookings/[id] - تعديل حجز
export async function PUT(
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

        const booking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: body,
            include: {
                room: true,
                customer: true,
                drinkOrders: {
                    include: { drink: true },
                },
            },
        });

        return NextResponse.json({ success: true, data: booking });
    } catch (error) {
        console.error("Update booking error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء تعديل الحجز" },
            { status: 500 }
        );
    }
}
