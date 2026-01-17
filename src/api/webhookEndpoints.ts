import api from './api';

/**
 * Interface representing a Webhook Endpoint.
 * Webhook endpoints are used by external services to send events to our platform.
 */
export interface WebhookEndpoint {
    id: string; // UUID
    public_path: string; // e.g., 'github/<trigger_id>/callback'
    secret: string; // Shared secret for signature verification
    metadata: Record<string, any>; // Service-specific metadata
    is_active: boolean;
    created_at: string; // ISO Date-time
    updated_at: string; // ISO Date-time
    external_service: string; // UUID
    area: string; // UUID
}

/**
 * Payload for creating a new Webhook Endpoint.
 */
export interface CreateWebhookEndpointPayload {
    public_path: string;
    secret: string;
    metadata?: Record<string, any>;
    is_active?: boolean;
    external_service: string; // UUID
    area: string; // UUID
}

/**
 * Payload for partially updating a Webhook Endpoint.
 */
export interface PatchWebhookEndpointPayload {
    public_path?: string;
    secret?: string;
    metadata?: Record<string, any>;
    is_active?: boolean;
    external_service?: string; // UUID
    area?: string; // UUID
}

/**
 * Fetches a list of all webhook endpoints.
 * GET /area_api/webhook-endpoints/
 */
export const getWebhookEndpoints = async (): Promise<WebhookEndpoint[]> => {
    const response = await api.get<WebhookEndpoint[]>('webhook-endpoints/');
    return response.data;
};

/**
 * Creates a new webhook endpoint.
 * POST /area_api/webhook-endpoints/
 */
export const createWebhookEndpoint = async (payload: CreateWebhookEndpointPayload): Promise<WebhookEndpoint> => {
    const response = await api.post<WebhookEndpoint>('webhook-endpoints/', payload);
    return response.data;
};

/**
 * Fetches a single webhook endpoint by its ID.
 * GET /area_api/webhook-endpoints/{id}/
 */
export const getWebhookEndpoint = async (id: string): Promise<WebhookEndpoint> => {
    const response = await api.get<WebhookEndpoint>(`webhook-endpoints/${id}/`);
    return response.data;
};

/**
 * Updates an existing webhook endpoint (full update).
 * PUT /area_api/webhook-endpoints/{id}/
 */
export const updateWebhookEndpoint = async (id: string, payload: CreateWebhookEndpointPayload): Promise<WebhookEndpoint> => {
    const response = await api.put<WebhookEndpoint>(`webhook-endpoints/${id}/`, payload);
    return response.data;
};

/**
 * Partially updates an existing webhook endpoint.
 * PATCH /area_api/webhook-endpoints/{id}/
 */
export const patchWebhookEndpoint = async (id: string, payload: PatchWebhookEndpointPayload): Promise<WebhookEndpoint> => {
    const response = await api.patch<WebhookEndpoint>(`webhook-endpoints/${id}/`, payload);
    return response.data;
};

/**
 * Deletes a webhook endpoint.
 * DELETE /area_api/webhook-endpoints/{id}/
 */
export const deleteWebhookEndpoint = async (id: string): Promise<void> => {
    await api.delete(`webhook-endpoints/${id}/`);
};
