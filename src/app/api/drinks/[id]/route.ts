import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// PUT /api/drinks/[id] - تعديل مشروب
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
        const { name, price, isAvailable } = body;

        const drink = await prisma.drink.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(isAvailable !== undefined && { isAvailable }),
            },
        });

        return NextResponse.json({ success: true, data: drink });
    } catch (error) {
        console.error("Update drink error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء تعديل المشروب" },
            { status: 500 }
        );
    }
}

// DELETE /api/drinks/[id] - حذف مشروب
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

        await prisma.drink.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete drink error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء حذف المشروب" },
            { status: 500 }
        );
    }
}
