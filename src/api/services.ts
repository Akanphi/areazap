import api from './api';

/**
 * Consent & OAuth
 */
export interface ConsentResponse {
    authorization_url: string | null;
}

export const getConsentUrl = async (serviceSlug: string, consent: boolean): Promise<ConsentResponse> => {
    const response = await api.post<ConsentResponse>(`consent/${serviceSlug}/`, { consent });
    return response.data;
};

export const requestConsent = async (serviceSlug: string): Promise<any> => {
    const response = await api.post(`consent/${serviceSlug}/`, { consent: true });
    return response.data;
};

/**
 * GitHub Endpoints
 */
export const getGithubMe = async (): Promise<any> => {
    const response = await api.get('github/me/');
    return response.data;
};

export const getGithubRepos = async (): Promise<any> => {
    const response = await api.get('github/repos/');
    return response.data;
};

export const getGithubIssues = async (repoFullName: string): Promise<any> => {
    const response = await api.get('github/user/issues/', {
        params: { repo_full_name: repoFullName },
    });
    return response.data;
};

export const getGithubPulls = async (repoFullName: string): Promise<any> => {
    const response = await api.get('github/user/pulls/', {
        params: { repo_full_name: repoFullName },
    });
    return response.data;
};

/**
 * GitLab Endpoints
 */
export const getGitlabMe = async (): Promise<any> => {
    const response = await api.get('gitlab/me/');
    return response.data;
};

export const getGitlabProjects = async (): Promise<any> => {
    const response = await api.get('gitlab/projects/');
    return response.data;
};

export const getGitlabBranches = async (projectId: number): Promise<any> => {
    const response = await api.get('gitlab/user/branches/', {
        params: { project_id: projectId },
    });
    return response.data;
};

export const getGitlabIssues = async (projectId: number): Promise<any> => {
    const response = await api.get('gitlab/user/issues/', {
        params: { project_id: projectId },
    });
    return response.data;
};

export const getGitlabMergeRequests = async (projectId: number): Promise<any> => {
    const response = await api.get('gitlab/user/merge_requests/', {
        params: { project_id: projectId },
    });
    return response.data;
};

/**
 * Slack Endpoints
 */
export const getSlackChannels = async (): Promise<any> => {
    const response = await api.get('slack/channels/');
    return response.data;
};

export const getSlackEmojis = async (): Promise<any> => {
    const response = await api.get('slack/emojis/');
    return response.data;
};

export const getSlackMessages = async (channelId: string): Promise<any> => {
    const response = await api.get('slack/messages/', {
        params: { channel_id: channelId },
    });
    return response.data;
};

/**
 * Returns the list of valid events that can be used when creating a Slack message (mock/placeholder if needed).
 */
export const getSlackUsers = async (): Promise<any[]> => {
    const response = await api.get<any[]>('slack/users/');
    return response.data;
};

/**
 * Returns the list of valid events that can be used when creating a GitHub webhook.
 * GET /area_api/github/webhooks/create/possible_events/
 */
export const getGithubWebhookEvents = async (): Promise<string[]> => {
    const response = await api.get<string[]>('github/webhooks/create/possible_events/');
    return response.data;
};

/**
 * Returns the list of valid events that can be used when creating a GitLab webhook.
 * GET /area_api/gitlab/webhooks/create/possible_events/
 */
export const getGitlabWebhookEvents = async (): Promise<string[]> => {
    const response = await api.get<string[]>('gitlab/webhooks/create/possible_events/');
    return response.data;
};

/**
 * Handles the OAuth callback.
 * GET /area_api/oauth/callback/
 */
export const handleOAuthCallback = async (params?: Record<string, string>): Promise<any> => {
    const response = await api.get('oauth/callback/', { params });
    return response.data;
};

/**
 * Returns the OpenApi3 schema for this API.
 * GET /area_api/schema/
 */
export const getApiSchema = async (format?: 'json' | 'yaml', lang?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (format) params.append('format', format);
    if (lang) params.append('lang', lang);

    const response = await api.get(`schema/?${params.toString()}`);
    return response.data;
};

/**
 * External Services & Definitions
 */
import { ExternalService, ServiceDefinition } from '@/types/api';

export const getExternalServices = async (): Promise<ExternalService[]> => {
    const response = await api.get<ExternalService[]>('external-services/');
    return response.data;
};

export const getServiceDefinitions = async (serviceSlug: string): Promise<ServiceDefinition> => {
    const response = await api.get<ServiceDefinition>(`services/${serviceSlug}/definitions/`);
    return response.data;
};
