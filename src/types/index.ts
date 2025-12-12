export interface CreateObjectPayload {
    name: string;
    data: {
        year: number;
        price: number;
        cpu: string;
        hardDisk: number;
    };
}

export interface CreatedObjectResponse {
    id: string | number;
    name: string;
    data: {
        year: number;
        price: number;
        cpu: string;
        hardDisk: number;
    };
}

export interface ErrorResponse {
    status?: number;
    message: string | object;
}

export interface QueryStringParam {
    query: string;
}

export interface ObjectsState {
    created: CreatedObjectResponse[];
    fetched: any[];
    loading: boolean;
    error: ErrorResponse | null;
    lastCreatedId: string | number | null;
}

export const initialState: ObjectsState = {
    created: [],
    fetched: [],
    loading: false,
    error: null,
    lastCreatedId: null,
};