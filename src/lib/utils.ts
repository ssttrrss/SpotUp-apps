import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// دمج أسماء الكلاسات
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// تنسيق التاريخ بالعربية
export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// تنسيق الوقت بالعربية
export function formatTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

// تنسيق التاريخ والوقت معًا
export function formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// تنسيق المبلغ بالعملة
export function formatCurrency(amount: number): string {
    return `${amount.toFixed(2)} ج.م`;
}

// حساب مدة الحجز بالدقائق
export function calculateDurationMinutes(
    startTime: Date | string,
    endTime: Date | string
): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

// تنسيق المدة بالساعات والدقائق
export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
        return `${mins} دقيقة`;
    } else if (mins === 0) {
        return `${hours} ساعة`;
    } else {
        return `${hours} ساعة و ${mins} دقيقة`;
    }
}

// حساب تكلفة الحجز
export function calculateRoomCost(
    durationMinutes: number,
    hourlyRate: number
): number {
    return (durationMinutes / 60) * hourlyRate;
}

// التحقق من صحة البريد الإلكتروني
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// التحقق من صحة رقم الهاتف المصري
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^01[0125][0-9]{8}$/;
    return phoneRegex.test(phone);
}
