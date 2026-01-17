import api from './api';

export enum AreaRunStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    SUCCESS = 'success',
    FAILED = 'failed',
}

export interface AreaRun {
    id: string;
    area_id: string;
    area_trigger_id: string;
    service_account_id: string;
    status: AreaRunStatus;
    context: Record<string, any>;
    trigger_payload: Record<string, any>;
    error_code: string | null;
    error_message_short: string | null;
    sentry_event_id: string | null;
    started_at: string | null;
    finished_at: string | null;
    created_at: string;
}

export interface CreateAreaRunPayload {
    area_id: string;
    area_trigger_id: string;
    service_account_id: string;
    status: AreaRunStatus;
    context: Record<string, any>;
    trigger_payload: Record<string, any>;
    error_code?: string | null;
    error_message_short?: string | null;
    sentry_event_id?: string | null;
    started_at?: string | null;
    finished_at?: string | null;
    created_at?: string;
}

export interface PatchAreaRunPayload {
    area_id?: string;
    area_trigger_id?: string;
    service_account_id?: string;
    status?: AreaRunStatus;
    context?: Record<string, any>;
    trigger_payload?: Record<string, any>;
    error_code?: string | null;
    error_message_short?: string | null;
    sentry_event_id?: string | null;
    started_at?: string | null;
    finished_at?: string | null;
    created_at?: string;
}

/**
 * Returns all the area runs for the current user.
 * GET /area_api/area-runs/
 */
export const getAreaRuns = async (): Promise<AreaRun[]> => {
    const response = await api.get<AreaRun[]>('area-runs/');
    return response.data;
};

/**
 * Creates a new area run.
 * POST /area_api/area-runs/
 */
export const createAreaRun = async (payload: CreateAreaRunPayload): Promise<AreaRun> => {
    const response = await api.post<AreaRun>('area-runs/', payload);
    return response.data;
};

/**
 * Returns a specific area run.
 * GET /area_api/area-runs/{id}/
 */
export const getAreaRun = async (id: string): Promise<AreaRun> => {
    const response = await api.get<AreaRun>(`area-runs/${id}/`);
    return response.data;
};

/**
 * Updates a specific area run (PUT).
 * PUT /area_api/area-runs/{id}/
 */
export const updateAreaRun = async (id: string, payload: CreateAreaRunPayload): Promise<AreaRun> => {
    const response = await api.put<AreaRun>(`area-runs/${id}/`, payload);
    return response.data;
};

/**
 * Updates a specific area run (PATCH).
 * PATCH /area_api/area-runs/{id}/
 */
export const patchAreaRun = async (id: string, payload: PatchAreaRunPayload): Promise<AreaRun> => {
    const response = await api.patch<AreaRun>(`area-runs/${id}/`, payload);
    return response.data;
};

/**
 * Deletes a specific area run.
 * DELETE /area_api/area-runs/{id}/
 */
export const deleteAreaRun = async (id: string): Promise<void> => {
    await api.delete(`area-runs/${id}/`);
};
