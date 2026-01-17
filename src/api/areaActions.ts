import api from './api';

export enum AreaActionStatus {
    ACTIVE = 'active',
    DISABLED = 'disabled',
    ERROR = 'error',
}

export enum AreaActionType {
    GITHUB_CREATE_ISSUE = 'github.create_issue',
    GITHUB_CLOSE_ISSUE = 'github.close_issue',
    GITHUB_COMMENT_ISSUE = 'github.comment_issue',
    GITHUB_ADD_LABELS_TO_ISSUE = 'github.add_labels_to_issue',
    GITHUB_ASSIGN_ISSUE = 'github.assign_issue',
    GITHUB_COMMENT_PULL_REQUEST = 'github.comment_pull_request',
    GITHUB_MERGE_PULL_REQUEST = 'github.merge_pull_request',
    GITHUB_CLOSE_PULL_REQUEST = 'github.close_pull_request',
    GITHUB_CREATE_RELEASE = 'github.create_release',
    GITHUB_CREATE_FILE = 'github.create_file',
    GITHUB_UPDATE_FILE = 'github.update_file',
    GITHUB_CREATE_WEBHOOK = 'github.create_webhook',
    GITHUB_CREATE_REPOSITORY = 'github.create_repository',
    GITLAB_CREATE_ISSUE = 'gitlab.create_issue',
    GITLAB_CLOSE_ISSUE = 'gitlab.close_issue',
    GITLAB_COMMENT_ISSUE = 'gitlab.comment_issue',
    GITLAB_ADD_LABELS_TO_ISSUE = 'gitlab.add_labels_to_issue',
    GITLAB_ASSIGN_ISSUE = 'gitlab.assign_issue',
    GITLAB_COMMENT_MERGE_REQUEST = 'gitlab.comment_merge_request',
    GITLAB_MERGE_MERGE_REQUEST = 'gitlab.merge_merge_request',
    GITLAB_CLOSE_MERGE_REQUEST = 'gitlab.close_merge_request',
    GITLAB_CREATE_RELEASE = 'gitlab.create_release',
    GITLAB_CREATE_FILE = 'gitlab.create_file',
    GITLAB_UPDATE_FILE = 'gitlab.update_file',
    GITLAB_CREATE_WEBHOOK = 'gitlab.create_webhook',
    GITLAB_CREATE_PROJECT = 'gitlab.create_project',
    SLACK_SEND_MESSAGE = 'slack.send_message',
    SLACK_SEND_DM = 'slack.send_dm',
    SLACK_ADD_REACTION = 'slack.add_reaction',
    SLACK_UPLOAD_FILE = 'slack.upload_file',
    SLACK_SET_CHANNEL_TOPIC = 'slack.set_channel_topic',
    SLACK_SET_CHANNEL_PURPOSE = 'slack.set_channel_purpose',
    SLACK_INVITE_USER = 'slack.invite_user',
    SLACK_ARCHIVE_CHANNEL = 'slack.archive_channel',
    SLACK_UNARCHIVE_CHANNEL = 'slack.unarchive_channel',
    SLACK_CREATE_CHANNEL = 'slack.create_channel',
    GOOGLE_SEND_EMAIL = 'google.send_email',
}

export interface AreaAction {
    id: string;
    external_service: string;
    action_type: AreaActionType | string;
    config: Record<string, any>;
    order_index: number;
    service_account: string;
    status: AreaActionStatus;
    name: string;
    input_mapping: Record<string, any>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    area: string;
}

export interface CreateAreaActionPayload {
    external_service: string;
    action_type: AreaActionType | string;
    config: Record<string, any>;
    status?: AreaActionStatus;
    name: string;
    input_mapping?: Record<string, any>;
    is_active?: boolean;
    area: string;
}

export const getAreaActions = async (): Promise<AreaAction[]> => {
    const response = await api.get<AreaAction[]>('area-actions/');
    return response.data;
};

export const createAreaAction = async (payload: CreateAreaActionPayload): Promise<AreaAction> => {
    const response = await api.post<AreaAction>('area-actions/', payload);
    return response.data;
};

export const getAreaAction = async (id: string): Promise<AreaAction> => {
    const response = await api.get<AreaAction>(`area-actions/${id}/`);
    return response.data;
};

export const updateAreaAction = async (id: string, payload: CreateAreaActionPayload): Promise<AreaAction> => {
    const response = await api.put<AreaAction>(`area-actions/${id}/`, payload);
    return response.data;
};

export const deleteAreaAction = async (id: string): Promise<void> => {
    await api.delete(`area-actions/${id}/`);
};

export interface PatchAreaActionPayload {
    external_service?: string;
    action_type?: AreaActionType | string;
    config?: Record<string, any>;
    status?: AreaActionStatus;
    name?: string;
    input_mapping?: Record<string, any>;
    is_active?: boolean;
    area?: string;
}

export const patchAreaAction = async (id: string, payload: PatchAreaActionPayload): Promise<AreaAction> => {
    const response = await api.patch<AreaAction>(`area-actions/${id}/`, payload);
    return response.data;
};

export interface ActionServiceAuthorizeResponse {
    authorized: boolean;
    authorization_url?: string | null;
}

export const authorizeAreaAction = async (id: string, payload: CreateAreaActionPayload): Promise<ActionServiceAuthorizeResponse> => {
    const response = await api.post<ActionServiceAuthorizeResponse>(`area-actions/${id}/authorize/`, payload);
    return response.data;
};

export const changeAreaActionStatus = async (id: string, newStatus: 'active' | 'disabled'): Promise<AreaAction> => {
    const response = await api.post<AreaAction>(`area-actions/${id}/change_status/?new_status=${newStatus}`);
    return response.data;
};

export interface AreaActionOrder {
    id: string;
    order_index: number;
}

export interface AreaActionReorderPayload {
    area_id: string;
    actions: AreaActionOrder[];
}

export interface AreaActionReorderResponse {
    status: string;
    message: string;
}

export const reorderAreaActions = async (payload: AreaActionReorderPayload): Promise<AreaActionReorderResponse> => {
    const response = await api.post<AreaActionReorderResponse>('area-actions/reorder/', payload);
    return response.data;
};
