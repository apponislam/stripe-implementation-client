export interface TErrorSource {
    path: string;
    message: string;
}

export interface TApiErrorResponse {
    success: false;
    message: string;
    errorSources: TErrorSource[];
    stack?: string | null;
}
