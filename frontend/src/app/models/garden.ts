export interface Garden {
    _id: string;
    id: number;
    owner: string;
    name: string;
    place: string;
    rows: number;
    cols: number;
    free: number;
    water: number;
    temperature: number;
    lastUpdate: string;
    plants:
    {
        row: number;
        col: number;
        plant: {
            name: string;
            companyName: string;
            companyUsername: string;
        },
        startDate: string;
        finishDate: string;
        progress: number;
    }[],
    products: {
        id: string;
        name: string;
        type: string;
        companyName: string;
        companyUsername: string;
        amount: number;
        time: number;
        orderId: number;
        deliveryDate: string;
    }[]
}