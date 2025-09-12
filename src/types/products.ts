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

// Backend Enums
export const RestrictionEnum = {
    GLUTEN_FREE: 'GLUTEN_FREE',
    LACTOSE_FREE: 'LACTOSE_FREE',
    SUGAR_FREE: 'SUGAR_FREE',
    VEGAN: 'VEGAN'
} as const;

export const ProductTypeEnum = {
    FOOD: 'FOOD',
    BEVERAGE: 'BEVERAGE'
} as const;

export type RestrictionEnum = typeof RestrictionEnum[keyof typeof RestrictionEnum];
export type ProductTypeEnum = typeof ProductTypeEnum[keyof typeof ProductTypeEnum];

// Create Product interfaces
export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    restrictions: RestrictionEnum[];
    sides: string[];
    allowsClarifications: boolean;
    type: ProductTypeEnum;
    photo?: string;
    stock: number;
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface CreateProductResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        name: string;
        type: string;
    };
    errors?: ValidationError[];
}

// Mapping for frontend restriction strings to backend enums
export const RESTRICTION_MAPPING: Record<string, RestrictionEnum> = {
    'Sin gluten': RestrictionEnum.GLUTEN_FREE,
    'Sin lactosa': RestrictionEnum.LACTOSE_FREE,
    'Sin azúcar': RestrictionEnum.SUGAR_FREE,
    'Vegano': RestrictionEnum.VEGAN,
};

// Helper function to map frontend restrictions to backend enums
export const mapRestrictionsToEnum = (restrictions: string[]): RestrictionEnum[] => {
    return restrictions
        .map(restriction => RESTRICTION_MAPPING[restriction])
        .filter(Boolean) as RestrictionEnum[];
};

// Helper function to map backend enums to frontend strings
export const mapRestrictionsToStrings = (restrictions: string[]): string[] => {
    const reverseMapping: Record<string, string> = {
        [RestrictionEnum.GLUTEN_FREE]: 'Sin gluten',
        [RestrictionEnum.LACTOSE_FREE]: 'Sin lactosa',
        [RestrictionEnum.SUGAR_FREE]: 'Sin azúcar',
        [RestrictionEnum.VEGAN]: 'Vegano',
    };
    
    return restrictions
        .map(restriction => reverseMapping[restriction])
        .filter(Boolean) as string[];
};
