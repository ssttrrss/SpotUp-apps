// أنواع المستخدمين
export type UserRole = "admin" | "employee";

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

// أنواع الغرف
export type RoomStatus = "available" | "occupied";

export interface Room {
    id: number;
    name: string;
    hourlyRate: number;
    status: RoomStatus;
    createdAt: Date;
}

// أنواع العملاء
export interface Customer {
    id: number;
    name: string;
    phone: string;
    notes?: string | null;
    createdAt: Date;
}

// أنواع المشروبات
export interface Drink {
    id: number;
    name: string;
    price: number;
    isAvailable: boolean;
}

// أنواع الحجوزات
export type BookingType = "fixed" | "open";
export type BookingStatus = "active" | "completed";

export interface Booking {
    id: number;
    type: BookingType;
    startTime: Date;
    endTime?: Date | null;
    roomCost: number;
    drinksCost: number;
    totalCost: number;
    status: BookingStatus;
    createdAt: Date;
    room: Room;
    customer: Customer;
    user: User;
    drinkOrders: DrinkOrder[];
}

// أنواع طلبات المشروبات
export interface DrinkOrder {
    id: number;
    quantity: number;
    totalPrice: number;
    drink: Drink;
    createdAt: Date;
}

// واجهات API Response
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

// إحصائيات لوحة التحكم
export interface DashboardStats {
    activeBookings: number;
    availableRooms: number;
    occupiedRooms: number;
    todayIncome: number;
    totalCustomers: number;
}
