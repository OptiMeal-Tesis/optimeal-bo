// Product interfaces
export interface Product {
    id: number;
    name: string;
    description: string;
    photo?: string;
    price: number;
    restrictions: string[];
    sides: string[];
    admitsClarifications: boolean;
    type: string;
    createdAt: string;
    updatedAt: string;
    stock: number;
}

export interface ProductListResponse {
    success: boolean;
    message: string;
    data: Product[];
    total: number;
}
