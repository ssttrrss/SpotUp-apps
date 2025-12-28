import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/rooms/[id] - غرفة واحدة
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
        const room = await prisma.room.findUnique({
            where: { id: parseInt(id) },
        });

        if (!room) {
            return NextResponse.json(
                { success: false, error: "الغرفة غير موجودة" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: room });
    } catch (error) {
        console.error("Get room error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ" },
            { status: 500 }
        );
    }
}

// PUT /api/rooms/[id] - تعديل غرفة
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

        if (!(await isAdmin())) {
            return NextResponse.json(
                { success: false, error: "غير مصرح لك بهذه العملية" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { name, hourlyRate, status } = body;

        const room = await prisma.room.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(hourlyRate !== undefined && { hourlyRate: parseFloat(hourlyRate) }),
                ...(status && { status }),
            },
        });

        return NextResponse.json({ success: true, data: room });
    } catch (error) {
        console.error("Update room error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء تعديل الغرفة" },
            { status: 500 }
        );
    }
}

// DELETE /api/rooms/[id] - حذف غرفة
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

        if (!(await isAdmin())) {
            return NextResponse.json(
                { success: false, error: "غير مصرح لك بهذه العملية" },
                { status: 403 }
            );
        }

        const { id } = await params;

        // التحقق من عدم وجود حجوزات نشطة
        const activeBookings = await prisma.booking.count({
            where: {
                roomId: parseInt(id),
                status: "active",
            },
        });

        if (activeBookings > 0) {
            return NextResponse.json(
                { success: false, error: "لا يمكن حذف الغرفة، توجد حجوزات نشطة" },
                { status: 400 }
            );
        }

        await prisma.room.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete room error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء حذف الغرفة" },
            { status: 500 }
        );
    }
}
