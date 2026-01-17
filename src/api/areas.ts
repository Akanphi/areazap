import api from './api';
import { AreaAction } from './areaActions';
import { AreaTrigger } from './areaTriggers';

export enum AreaStatus {
    DRAFT = 'draft',
    CONFIGURED = 'configured',
    ACTIVE = 'active',
    DISABLED = 'disabled',
}

export interface Area {
    id: string;
    triggers: AreaTrigger[];
    actions: AreaAction[];
    name: string;
    description: string | null;
    status: AreaStatus;
    global_config: Record<string, any> | null;
    runs_count: number;
    created_at: string;
    updated_at: string;
}

export interface CreateAreaPayload {
    name: string;
    description?: string | null;
    status?: AreaStatus;
    global_config?: Record<string, any> | null;
}

export const getAreas = async (): Promise<Area[]> => {
    const response = await api.get<Area[]>('areas/');
    return response.data;
};

export const createArea = async (payload: CreateAreaPayload): Promise<Area> => {
    const response = await api.post<Area>('areas/', payload);
    return response.data;
};

export const getArea = async (id: string): Promise<Area> => {
    const response = await api.get<Area>(`areas/${id}/`);
    return response.data;
};

export const updateArea = async (id: string, payload: CreateAreaPayload): Promise<Area> => {
    const response = await api.put<Area>(`areas/${id}/`, payload);
    return response.data;
};

export interface PatchAreaPayload {
    name?: string;
    description?: string | null;
    status?: AreaStatus;
    global_config?: Record<string, any> | null;
}

export const patchArea = async (id: string, payload: PatchAreaPayload): Promise<Area> => {
    const response = await api.patch<Area>(`areas/${id}/`, payload);
    return response.data;
};

export const deleteArea = async (id: string): Promise<void> => {
    await api.delete(`areas/${id}/`);
};

export const changeAreaStatus = async (id: string, newStatus: 'active' | 'disabled'): Promise<Area> => {
    const response = await api.post<Area>(`areas/${id}/change_status/`, null, {
        params: { new_status: newStatus },
    });
    return response.data;
};

export const validateArea = async (id: string): Promise<Area> => {
    const response = await api.post<Area>(`areas/${id}/validate/`);
    return response.data;
};

export interface DraftArea {
    id: string;
    name: string;
    description: string | null;
    status: AreaStatus;
    created_at: string;
    missing_components: string;
}

export const getDraftAreas = async (): Promise<DraftArea[]> => {
    const response = await api.get<DraftArea[]>('areas/drafts/');
    return response.data;
};
