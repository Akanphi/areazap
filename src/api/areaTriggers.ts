import api from './api';

export enum AreaTriggerType {
    GITHUB_NEW_ISSUE = 'github.new_issue',
    GITHUB_ISSUE_CLOSED = 'github.issue_closed',
    GITHUB_ISSUE_REOPENED = 'github.issue_reopened',
    GITHUB_NEW_PULL_REQUEST = 'github.new_pull_request',
    GITHUB_PULL_REQUEST_CLOSED = 'github.pull_request_closed',
    GITHUB_PULL_REQUEST_MERGED = 'github.pull_request_merged',
    GITHUB_PULL_REQUEST_REOPENED = 'github.pull_request_reopened',
    GITHUB_PUSH = 'github.push',
    GITHUB_RELEASE_PUBLISHED = 'github.release_published',
    GITHUB_RELEASE_CREATED = 'github.release_created',
    GITHUB_REPO_FORKED = 'github.repo_forked',
    GITHUB_REPO_STARRED = 'github.repo_starred',
    GITHUB_LABEL_CREATED = 'github.label_created',
    GITHUB_LABEL_DELETED = 'github.label_deleted',
    GITHUB_MILESTONE_CREATED = 'github.milestone_created',
    GITHUB_MILESTONE_CLOSED = 'github.milestone_closed',
    GITHUB_MILESTONE_REOPENED = 'github.milestone_reopened',
    GITLAB_NEW_ISSUE = 'gitlab.new_issue',
    GITLAB_ISSUE_CLOSED = 'gitlab.issue_closed',
    GITLAB_ISSUE_REOPENED = 'gitlab.issue_reopened',
    GITLAB_NEW_MERGE_REQUEST = 'gitlab.new_merge_request',
    GITLAB_MERGE_REQUEST_CLOSED = 'gitlab.merge_request_closed',
    GITLAB_MERGE_REQUEST_MERGED = 'gitlab.merge_request_merged',
    GITLAB_MERGE_REQUEST_REOPENED = 'gitlab.merge_request_reopened',
    GITLAB_PUSH = 'gitlab.push',
    GITLAB_LABEL_CREATED = 'gitlab.label_created',
    GITLAB_LABEL_DELETED = 'gitlab.label_deleted',
    GITLAB_MILESTONE_CREATED = 'gitlab.milestone_created',
    GITLAB_MILESTONE_CLOSED = 'gitlab.milestone_closed',
    GITLAB_MILESTONE_REOPENED = 'gitlab.milestone_reopened',
    GITLAB_PIPELINE_CREATED = 'gitlab.pipeline_created',
    GITLAB_PIPELINE_SUCCEEDED = 'gitlab.pipeline_succeeded',
    GITLAB_PIPELINE_FAILED = 'gitlab.pipeline_failed',
    GITLAB_TAG_PUSHED = 'gitlab.tag_pushed',
    GOOGLE_NEW_EMAIL = 'google.new_email',
}

export interface AreaTrigger {
    id: string;
    external_service: string;
    type: AreaTriggerType | string;
    config: Record<string, any>;
    service_account: string;
    event_type: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    area: string;
}

export interface CreateAreaTriggerPayload {
    external_service: string;
    type: AreaTriggerType | string;
    config: Record<string, any>;
    event_type: string;
    is_active: boolean;
    area: string;
}

export interface PatchAreaTriggerPayload {
    external_service?: string;
    type?: AreaTriggerType | string;
    config?: Record<string, any>;
    event_type?: string;
    is_active?: boolean;
    area?: string;
}

export interface TriggerAuthorizationResponse {
    authorized: boolean;
    authorization_url: string | null;
}

export interface TriggerConfigResponse {
    trigger: string;
    required_fields: string[];
    optional_fields: string[];
}

/**
 * Returns all the area triggers for the current user.
 * GET /area_api/area-triggers/
 */
export const getAreaTriggers = async (): Promise<AreaTrigger[]> => {
    const response = await api.get<AreaTrigger[]>('area-triggers/');
    return response.data;
};

/**
 * Creates a new area trigger.
 * POST /area_api/area-triggers/
 */
export const createAreaTrigger = async (payload: CreateAreaTriggerPayload): Promise<AreaTrigger> => {
    const response = await api.post<AreaTrigger>('area-triggers/', payload);
    return response.data;
};

/**
 * Returns a specific area trigger.
 * GET /area_api/area-triggers/{id}/
 */
export const getAreaTrigger = async (id: string): Promise<AreaTrigger> => {
    const response = await api.get<AreaTrigger>(`area-triggers/${id}/`);
    return response.data;
};

/**
 * Updates a specific area trigger (PUT).
 * PUT /area_api/area-triggers/{id}/
 */
export const updateAreaTrigger = async (id: string, payload: CreateAreaTriggerPayload): Promise<AreaTrigger> => {
    const response = await api.put<AreaTrigger>(`area-triggers/${id}/`, payload);
    return response.data;
};

/**
 * Updates a specific area trigger (PATCH).
 * PATCH /area_api/area-triggers/{id}/
 */
export const patchAreaTrigger = async (id: string, payload: PatchAreaTriggerPayload): Promise<AreaTrigger> => {
    const response = await api.patch<AreaTrigger>(`area-triggers/${id}/`, payload);
    return response.data;
};

/**
 * Deletes a specific area trigger.
 * DELETE /area_api/area-triggers/{id}/
 */
export const deleteAreaTrigger = async (id: string): Promise<void> => {
    await api.delete(`area-triggers/${id}/`);
};

/**
 * Initiates OAuth authorization for the trigger's external service.
 * POST /area_api/area-triggers/{id}/authorize/
 */
export const authorizeAreaTrigger = async (id: string, payload: CreateAreaTriggerPayload): Promise<TriggerAuthorizationResponse> => {
    const response = await api.post<TriggerAuthorizationResponse>(`area-triggers/${id}/authorize/`, payload);
    return response.data;
};

/**
 * Get required config fields for a trigger.
 * GET /area_api/area-triggers/config/{trigger_slug}/
 */
export const getAreaTriggerConfig = async (triggerSlug: string): Promise<TriggerConfigResponse> => {
    const response = await api.get<TriggerConfigResponse>(`area-triggers/config/${triggerSlug}/`);
    return response.data;
};
