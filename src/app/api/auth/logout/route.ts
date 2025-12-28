import { NextResponse } from "next/server";
import { logout } from "@/lib/auth";

// POST /api/auth/logout - تسجيل الخروج
export async function POST() {
    try {
        await logout();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء تسجيل الخروج" },
            { status: 500 }
        );
    }
}
