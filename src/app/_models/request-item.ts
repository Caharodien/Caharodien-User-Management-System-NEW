export class RequestItem {
    id?: number;
    name!: string;
    description?: string;
    quantity!: number;
    requestId?: number;
}

export class RequestItemCreate {
    name!: string;
    description?: string;
    quantity!: number;
}