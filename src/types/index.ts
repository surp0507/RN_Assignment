export interface CreateObjectPayload {
    name: string;
    data: {
        year: number;
        price: number;
        cpu: string;
        hardDisk: number;
    };
}