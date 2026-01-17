import api from './api';

/**
 * Enum representing the possible statuses of a Step Run.
 */
export enum StepRunStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    SUCCESS = 'success',
    FAILED = 'failed',
}

/**
 * Interface representing a Step Run.
 * A Step Run tracks the execution of an individual action within an automation run.
 */
export interface StepRun {
    id: string; // UUID
    order_index: number;
    status: StepRunStatus;
    input_payload: Record<string, any> | null;
    output_payload: Record<string, any> | null;
    error_code: string | null;
    error_message_short: string | null;
    sentry_event_id: string | null;
    started_at: string | null; // ISO Date-time
    finished_at: string | null; // ISO Date-time
    created_at: string; // ISO Date-time
    area_run: string; // UUID
    area_action: string; // UUID
}

/**
 * Payload for creating a new Step Run.
 */
export interface CreateStepRunPayload {
    order_index?: number;
    input_payload?: Record<string, any> | null;
    error_code?: string | null;
    error_message_short?: string | null;
    sentry_event_id?: string | null;
    area_run: string; // UUID
    area_action: string; // UUID
}

/**
 * Payload for partially updating a Step Run.
 */
export interface PatchStepRunPayload {
    order_index?: number;
    input_payload?: Record<string, any> | null;
    error_code?: string | null;
    error_message_short?: string | null;
    sentry_event_id?: string | null;
    area_run?: string; // UUID
    area_action?: string; // UUID
}

/**
 * Fetches a list of all step runs.
 * GET /area_api/step-runs/
 */
export const getStepRuns = async (): Promise<StepRun[]> => {
    const response = await api.get<StepRun[]>('step-runs/');
    return response.data;
};

/**
 * Creates a new step run.
 * POST /area_api/step-runs/
 */
export const createStepRun = async (payload: CreateStepRunPayload): Promise<StepRun> => {
    const response = await api.post<StepRun>('step-runs/', payload);
    return response.data;
};

/**
 * Fetches a single step run by its ID.
 * GET /area_api/step-runs/{id}/
 */
export const getStepRun = async (id: string): Promise<StepRun> => {
    const response = await api.get<StepRun>(`step-runs/${id}/`);
    return response.data;
};

/**
 * Updates an existing step run (full update).
 * PUT /area_api/step-runs/{id}/
 */
export const updateStepRun = async (id: string, payload: CreateStepRunPayload): Promise<StepRun> => {
    const response = await api.put<StepRun>(`step-runs/${id}/`, payload);
    return response.data;
};

/**
 * Partially updates an existing step run.
 * PATCH /area_api/step-runs/{id}/
 */
export const patchStepRun = async (id: string, payload: PatchStepRunPayload): Promise<StepRun> => {
    const response = await api.patch<StepRun>(`step-runs/${id}/`, payload);
    return response.data;
};

/**
 * Deletes a step run.
 * DELETE /area_api/step-runs/{id}/
 */
export const deleteStepRun = async (id: string): Promise<void> => {
    await api.delete(`step-runs/${id}/`);
};
