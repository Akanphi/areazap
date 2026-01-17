import api from './api';

export interface ExternalService {
    id: string;
    name: string;
    slug: string;
    auth_type: string;
    logo_url: string | null;
    capabilities: Record<string, any>;
}

/**
 * Returns all the services connected by the user.
 * GET /area_api/auth/external-services/
 */
export const getConnectedServices = async (): Promise<ExternalService[]> => {
    const response = await api.get<ExternalService[]>('auth/external-services/');
    return response.data;
};

/**
 * Returns a specific service connected by the user.
 * GET /area_api/auth/external-services/{id}/
 */
export const getConnectedService = async (id: string): Promise<ExternalService> => {
    const response = await api.get<ExternalService>(`auth/external-services/${id}/`);
    return response.data;
};

/**
 * Returns all the services supported by the platform.
 * GET /area_api/external-services/
 */
export const getSupportedServices = async (): Promise<ExternalService[]> => {
    const response = await api.get<ExternalService[]>('external-services/');
    return response.data;
};

/**
 * Returns a specific service supported by the platform.
 * GET /area_api/external-services/{id}/
 */
export const getSupportedService = async (id: string): Promise<ExternalService> => {
    const response = await api.get<ExternalService>(`external-services/${id}/`);
    return response.data;
};
