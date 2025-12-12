import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { CreateObjectPayload } from "../types";
export interface ObjectPayload {
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

const initialState: ObjectsState = {
    created: [],
    fetched: [],
    loading: false,
    error: null,
    lastCreatedId: null,
};

export const createObject = createAsyncThunk<
    CreatedObjectResponse,
    CreateObjectPayload,
    { rejectValue: ErrorResponse }
>(
    "objects/createObject",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post("/objects", payload);
            return response.data as CreatedObjectResponse;
        } catch (err: any) {
            if (err.response) {
                return rejectWithValue({
                    status: err.response.status,
                    message: err.response.data || err.message,
                });
            }
            return rejectWithValue({ message: err.message });
        }
    }
);

export const getObjectsByIds = createAsyncThunk<
    any[],
    string,
    { rejectValue: ErrorResponse }
>(
    "objects/getObjectsByIds",
    async (queryString, { rejectWithValue }) => {
        try {
            const response = await api.get(`/objects?id=${queryString}`);
            return response.data as any[];
        } catch (err: any) {
            if (err.response) {
                return rejectWithValue({
                    status: err.response.status,
                    message: err.response.data || err.message,
                });
            }
            return rejectWithValue({ message: err.message });
        }
    }
);


const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setFetchedFromStorage(state, action: PayloadAction<any[]>) {
            state.fetched = action.payload;
        },
        addLocallyCreated(state, action: PayloadAction<any>) {
            state.created.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createObject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createObject.fulfilled, (state, action) => {
                state.loading = false;
                state.created.push(action.payload);
                state.lastCreatedId = action.payload?.id ?? null;
            })
            .addCase(createObject.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as ErrorResponse) || {
                    message: action.error.message || "Unknown error",
                };
            })

            .addCase(getObjectsByIds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getObjectsByIds.fulfilled, (state, action) => {
                state.loading = false;
                state.fetched = action.payload;
            })
            .addCase(getObjectsByIds.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as ErrorResponse) || {
                    message: action.error.message || "Unknown error",
                };
            });
    },
});

export const { setFetchedFromStorage, addLocallyCreated } = productSlice.actions;
export default productSlice.reducer;
