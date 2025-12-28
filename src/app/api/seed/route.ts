import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

// POST /api/seed - إنشاء بيانات تجريبية
export async function POST() {
    try {
        // إنشاء مستخدم أدمن
        const adminExists = await prisma.user.findUnique({
            where: { email: "admin@letsgo.com" },
        });

        if (!adminExists) {
            await prisma.user.create({
                data: {
                    name: "مدير النظام",
                    email: "admin@letsgo.com",
                    password: hashPassword("admin123"),
                    role: "admin",
                },
            });
        }

        // إنشاء مستخدم موظف
        const employeeExists = await prisma.user.findUnique({
            where: { email: "employee@letsgo.com" },
        });

        if (!employeeExists) {
            await prisma.user.create({
                data: {
                    name: "أحمد الموظف",
                    email: "employee@letsgo.com",
                    password: hashPassword("employee123"),
                    role: "employee",
                },
            });
        }

        // إنشاء غرف
        const roomsExist = await prisma.room.count();
        if (roomsExist === 0) {
            await prisma.room.createMany({
                data: [
                    { name: "غرفة الاجتماعات الكبرى", hourlyRate: 150, status: "available" },
                    { name: "غرفة العمل المشترك", hourlyRate: 50, status: "available" },
                    { name: "المكتب الخاص 1", hourlyRate: 100, status: "available" },
                    { name: "المكتب الخاص 2", hourlyRate: 100, status: "available" },
                    { name: "قاعة التدريب", hourlyRate: 200, status: "available" },
                ],
            });
        }

        // إنشاء مشروبات
        const drinksExist = await prisma.drink.count();
        if (drinksExist === 0) {
            await prisma.drink.createMany({
                data: [
                    { name: "قهوة عربية", price: 15, isAvailable: true },
                    { name: "قهوة تركية", price: 20, isAvailable: true },
                    { name: "شاي", price: 10, isAvailable: true },
                    { name: "نسكافيه", price: 15, isAvailable: true },
                    { name: "كابتشينو", price: 25, isAvailable: true },
                    { name: "لاتيه", price: 25, isAvailable: true },
                    { name: "عصير برتقال", price: 20, isAvailable: true },
                    { name: "مياه معدنية", price: 5, isAvailable: true },
                ],
            });
        }

        // إنشاء عملاء
        const customersExist = await prisma.customer.count();
        if (customersExist === 0) {
            await prisma.customer.createMany({
                data: [
                    { name: "محمد أحمد", phone: "01012345678", notes: "عميل مميز" },
                    { name: "سارة خالد", phone: "01098765432", notes: null },
                    { name: "أحمد علي", phone: "01234567890", notes: "شركة تقنية" },
                ],
            });
        }

        return NextResponse.json({
            success: true,
            message: "تم إنشاء البيانات التجريبية بنجاح",
            credentials: {
                admin: { email: "admin@letsgo.com", password: "admin123" },
                employee: { email: "employee@letsgo.com", password: "employee123" },
            },
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ" },
            { status: 500 }
        );
    }
}
