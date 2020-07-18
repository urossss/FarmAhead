export interface Product {
    _id: string;
    id: number;
    name: string;
    type: string;
    companyName: string;
    companyUsername: string;
    amount: number;
    time: number;
}

export interface ProductWithDetails extends Product {
    ratingSum: number;
    ratingCount: number;
    price: number;
    buyers: [
        {
            farmer: string;
        }
    ],
    comments: [
        {
            farmer: string;
            rating: number;
            comment: string;
        }
    ],
}