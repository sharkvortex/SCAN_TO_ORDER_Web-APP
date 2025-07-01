export interface Food {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
}
export interface HistoryFoodType {
  id: number;
  orderSessionId: number;
  foodId: number;
  foodName: string;
  foodPrice: number;
  status: string;
  quantity: number;
  note: string | null;
}

export interface CategoryTypes {
  id: number;
  name: string;
}
