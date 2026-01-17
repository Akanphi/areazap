import api from './api';

export interface ExternalService {
    id: string;
    name: string;
    slug: string;
    auth_type: string;
    logo_url: string | null;
    capabilities: Record<string, any>;
}

export interface ServiceAccount {
    id: string;
    display_name: string;
    credentials_encrypted: Record<string, any>;
    scopes: Record<string, any>;
    expires_at: string | null;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
    user: string;
    external_service: string;
}

export interface CreateServiceAccountPayload {
    display_name: string;
    credentials_encrypted: Record<string, any>;
    scopes: Record<string, any>;
    expires_at?: string | null;
    metadata?: Record<string, any>;
    user: string;
    external_service: string;
}

export interface PatchServiceAccountPayload {
    display_name?: string;
    credentials_encrypted?: Record<string, any>;
    scopes?: Record<string, any>;
    expires_at?: string | null;
    metadata?: Record<string, any>;
    user?: string;
    external_service?: string;
}

/**
 * Returns all the service accounts for the current user.
 * GET /area_api/service-accounts/
 */
export const getServiceAccounts = async (): Promise<ServiceAccount[]> => {
    console.log(">>> FETCHING service-accounts");
    const response = await api.get<ServiceAccount[]>('service-accounts/');
    console.log(">>> RECEIVED service-accounts:", response.data);
    return response.data;
};

/**
 * Returns the list of external services connected by the user.
 * GET /area_api/auth/external-services/
 */
export const getConnectedServices = async (): Promise<ExternalService[]> => {
    console.log(">>> FETCHING connectedServices (auth/external-services/)");
    try {
        const response = await api.get<ExternalService[]>('auth/external-services/');
        console.log("connectedServices - BACKEND RETURN:", response.data);
        return response.data;
    } catch (error) {
        console.error("connectedServices - ERROR:", error);
        throw error;
    }
};

/**
 * Creates a new service account.
 * POST /area_api/service-accounts/
 */
export const createServiceAccount = async (payload: CreateServiceAccountPayload): Promise<ServiceAccount> => {
    const response = await api.post<ServiceAccount>('service-accounts/', payload);
    return response.data;
};

/**
 * Returns a specific service account.
 * GET /area_api/service-accounts/{id}/
 */
export const getServiceAccount = async (id: string): Promise<ServiceAccount> => {
    const response = await api.get<ServiceAccount>(`service-accounts/${id}/`);
    return response.data;
};

/**
 * Updates a specific service account (PUT).
 * PUT /area_api/service-accounts/{id}/
 */
export const updateServiceAccount = async (id: string, payload: CreateServiceAccountPayload): Promise<ServiceAccount> => {
    const response = await api.put<ServiceAccount>(`service-accounts/${id}/`, payload);
    return response.data;
};

/**
 * Updates a specific service account (PATCH).
 * PATCH /area_api/service-accounts/{id}/
 */
export const patchServiceAccount = async (id: string, payload: PatchServiceAccountPayload): Promise<ServiceAccount> => {
    const response = await api.patch<ServiceAccount>(`service-accounts/${id}/`, payload);
    return response.data;
};

/**
 * Deletes a specific service account.
 * DELETE /area_api/service-accounts/{id}/
 */
export const deleteServiceAccount = async (id: string): Promise<void> => {
    await api.delete(`service-accounts/${id}/`);
};
