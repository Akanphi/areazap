import api from './api';
import { TriggerConfigResponse } from './areaTriggers';

export const getTriggerConfig = async (triggerSlug: string): Promise<TriggerConfigResponse> => {
    const response = await api.get<TriggerConfigResponse>(`area-triggers/config/${triggerSlug}/`);
    return response.data;
};
