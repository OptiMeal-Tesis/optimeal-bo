export interface MainDish {
  id: number;
  name: string;
  totalToPrepare: number;
  preparedQuantity: number;
  photo: string;
  remainingToPrepare: number;
}

export interface Side {
  id: number;
  name: string;
  totalToPrepare: number;
  preparedQuantity: number;
  remainingToPrepare: number;
}

export interface ShiftSummaryData {
  shift: string;
  mainDishes: MainDish[];
  sides: Side[];
  totalMainDishes: number;
  totalSides: number;
}

export interface ShiftSummaryResponse {
  success: boolean;
  message: string;
  data: ShiftSummaryData;
}
