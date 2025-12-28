import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/customers/[id] - عميل واحد مع سجل الحجوزات
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
        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(id) },
            include: {
                bookings: {
                    include: {
                        room: true,
                    },
                    orderBy: { createdAt: "desc" },
                    take: 20,
                },
            },
        });

        if (!customer) {
            return NextResponse.json(
                { success: false, error: "العميل غير موجود" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: customer });
    } catch (error) {
        console.error("Get customer error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ" },
            { status: 500 }
        );
    }
}

// PUT /api/customers/[id] - تعديل عميل
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
        const { name, phone, notes } = body;

        const customer = await prisma.customer.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(phone && { phone }),
                ...(notes !== undefined && { notes }),
            },
        });

        return NextResponse.json({ success: true, data: customer });
    } catch (error) {
        console.error("Update customer error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء تعديل العميل" },
            { status: 500 }
        );
    }
}
