export interface Order {
    _id: string;
    id: number;
    companyUsername: string;
    gardenId: string;
    gardenPlace: string;
    orderDate: string;
    deliveryStartDate: string;
    deliveryDate: string;
    products: [
        {
            id: string;
            name: string;
            amount: number;
            price: number;
        }
    ]
}