export interface OrderTypes {
    code: string;
    orders: OrderItem[];
    status: string;
    totalAmount: number;
}

export interface OrderItem {
    id: number
    foodId: string;
    foodName: string;
    foodPrice: number;
    note: string;
    orderSessionId: number;
    quantity: number;
    status: number;
    createdAt: Date;
    updatedAt: Date;
}