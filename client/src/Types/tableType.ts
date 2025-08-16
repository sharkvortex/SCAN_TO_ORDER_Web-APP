export interface tableType {
  id: number;
  tableNumber: number;
  status: string;
  capacity: number;
  orderId: string
  token: string;
  note: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}
