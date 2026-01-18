import api from "./api";
import { useState, useEffect, ReactNode } from "react";

export interface ConfigMap {
  step: string;
  service: string;
  field: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface Props {
  field: ConfigMap;
  value: string;
  onChange: (value: string) => void;
  fallback: ReactNode;
  allValues: Record<string, any>;
}

// Configuration centralisée des endpoints
export type SelectOption = {
  label: string;
  value: string;
};

type EndpointConfig = {
  endpoint: string;
  parameter?: string;
  dependency?: string;
  transformResponse?: (data: any) => SelectOption[];
};

const FIELD_ENDPOINTS: Record<string, Record<string, Record<string, EndpointConfig>>> = {
  trigger: {
    github: {
      repository: {
        endpoint: "github/repos/",
        transformResponse: (data: any) => (data.repos || []).map((repo: string) => ({ label: repo, value: repo }))
      },
      issue_number: {
        endpoint: "github/user/issues/",
        parameter: "repo_full_name",
        dependency: "repository",
        transformResponse: (data: any) => (data.issues || []).map((issue: string) => ({ label: issue, value: issue }))
      },
      events: {
        endpoint: "github/webhooks/create/possible_events/",
        transformResponse: (data: any) => (Array.isArray(data) ? data : []).map((e: string) => ({ label: e, value: e }))
      },
      branch: {
        endpoint: "github/branches/",
        parameter: "repo_full_name",
        dependency: "repository"
      },
      pulls: {
        endpoint: "github/user/pulls/",
        parameter: "repo_full_name",
        dependency: "repository"
      },
      assignees: {
        endpoint: "github/assignees/",
        parameter: "repo_full_name",
        dependency: "repository",
        transformResponse: (data: any) => (data.assignees || []).map((u: string) => ({ label: u, value: u }))
      },
    },
    gitlab: {
      project_id: {
        endpoint: "gitlab/projects/",
        transformResponse: (data: any) => {
          const projects = Array.isArray(data) ? data : (data.projects || data.repos || []);
          return projects.map((p: any) => ({
            label: p.path_with_namespace || p.name || p.id?.toString() || p.toString(),
            value: p.id?.toString() || p.toString()
          }));
        }
      },
      merge_request_iid: {
          endpoint: "gitlab/user/merge-requests/",
          parameter: "project_id",
          dependency: "project_id",
          transformResponse: (data: any) => (data.merge_requests || []).map((mr: string) => ({ label: mr, value: mr }))
      },
      branch: {
        endpoint: "gitlab/user/branches/",
        parameter: "project_id",
        dependency: "project_id",
        transformResponse: (data: any) => (data.branches || []).map((c: any) => ({ label: c, value:  c}))
      },
      issue_iid: { 
        endpoint: "gitlab/user/issues/",
        parameter: "project_id",
        dependency: "project_id",
        transformResponse: (data: any) => (data.issues || []).map((issue: string) => ({ label: issue, value: issue }))
      },
      events: {
        endpoint: "gitlab/webhooks/create/possible_events/",
        transformResponse: (data: any) => (Array.isArray(data) ? data : []).map((e: string) => ({ label: e, value: e }))
      },
      assignee: {
        endpoint: "gitlab/users/",
        transformResponse: (data: any) => (Array.isArray(data) ? data : []).map((u: any) => ({ label: u.login || u, value: u.login || u }))
      },
    },
  },
  action: {
    github: {
      repository: {
        endpoint: "github/repos/",
        transformResponse: (data: any) => (data.repos || []).map((repo: string) => ({ label: repo, value: repo }))
      },
      assignees: {
        endpoint: "github/assignees/",
        parameter: "repo_full_name",
        dependency: "repository",
        transformResponse: (data: any) => (data.assignees || []).map((u: string) => ({ label: u, value: u }))
      },
      issue_number: {
        endpoint: "github/user/issues/",
        parameter: "repo_full_name",
        dependency: "repository",
        transformResponse: (data: any) => (data.issues || []).map((issue: string) => ({
          label: issue,
          value: issue.split(' - ').pop() || issue
        }))
      },
      branch: {
        endpoint: "github/branches/",
        parameter: "repo_full_name",
        dependency: "repository"
      },
      pulls: {
        endpoint: "github/user/pulls/",
        parameter: "repo_full_name",
        dependency: "repository"
      },
      events: {
        endpoint: "github/webhooks/create/possible_events/",
        transformResponse: (data: any) => (Array.isArray(data) ? data : []).map((e: string) => ({ label: e, value: e }))
      },
      pull_number: {
        endpoint: "github/user/pulls/",
        parameter: "repo_full_name",
        dependency: "repository",
        transformResponse: (data: any) => (data.pulls || []).map((p: string) => ({
          label: p,
          value: p.split(' - ').pop() || p
        }))
      }
    },
    gitlab: {
      project_id: {
        endpoint: "gitlab/projects/",
        transformResponse: (data: any) => {
          const projects = Array.isArray(data) ? data : (data.projects || data.repos || []);
          return projects.map((p: any) => ({
            label: p.path_with_namespace || p.name || p.id?.toString() || p.toString(),
            value: p.id?.toString() || p.toString()
          }));
        }
      },
      merge_request_iid: {
        endpoint: "gitlab/user/merge_requests/",
        parameter: "project_id",
        dependency: "project_id",
        transformResponse: (data: any) => (data.merge_requests || []).map((mr: string, index: string) => ({ label: mr, value: index }))
      },
     branch: {
        endpoint: "gitlab/user/branches/",
        parameter: "project_id",
        dependency: "project_id",
        transformResponse: (data: any) => (data.branches || []).map((c: any) => ({ label: c, value:  c}))
      },
      assignee: {
        endpoint: "gitlab/users/",

        transformResponse: (data: any) => (Array.isArray(data) ? data : []).map((u: any) => ({ label: u.login || u, value: u.login || u }))
      },
      issue_iid: { 
        endpoint: "gitlab/user/issues/",
        parameter: "project_id",
        dependency: "project_id",
        transformResponse: (data: any) => (data.issues || []).map((issue_iid: string) => ({
          label: issue_iid,
          value: issue_iid.split(' - ').pop() || issue_iid
        })),
      },
      events: {
        endpoint: "gitlab/webhooks/create/possible_events/",
        transformResponse: (data: any) => (Array.isArray(data) ? data : []).map((e: string) => ({ label: e, value: e }))
      },
    },
    slack: {
      channel: {
        endpoint: "slack/channels/",
        transformResponse: (data: any) => (data.channels || []).map((c: any) => ({ label: c.name || c, value: c.id || c }))
      },
      emojis: { endpoint: "slack/emojis/" },
      messages: { endpoint: "slack/messages/" },
      users: { endpoint: "slack/users/" }
    },
    todoist: {
      project_id: {
        endpoint: "todoist/projects/",
        transformResponse: (data: any) => {
          console.log("Todoist Projects Raw Data:", data);
          const projects = data.projects || data;
          return (Array.isArray(projects) ? projects : []).map((p: any) => ({
            label: p.name || p.full_name || p.id?.toString() || p.toString(),
            value: p.id?.toString() || p.toString()
          }));
        }
      },
      task_id: {
        endpoint: "todoist/tasks/",
        transformResponse: (data: any) => {
          console.log("Todoist Tasks Raw Data:", data);
          const tasks = data.tasks || data;
          return (Array.isArray(tasks) ? tasks : []).map((t: any) => ({
            label: t.content || t.name || t.id?.toString() || t.toString(),
            value: t.id?.toString() || t.toString()
          }));
        }
      },
    },
  },
};

// Hook personnalisé pour récupérer les options dynamiques
const useDynamicOptions = (field: ConfigMap, value: string, allValues: Record<string, any>) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const config = FIELD_ENDPOINTS[field.step]?.[field.service]?.[field.field];

    if (!config) {
      setOptions([]);
      return;
    }

    const fetchOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const params: Record<string, any> = {};

        if (config.dependency) {
          const dependencyValue = allValues[config.dependency];
          if (!dependencyValue) {
            setOptions([]);
            setLoading(false);
            return;
          }
          params[config.parameter || config.dependency] = dependencyValue;
        } else if (config.parameter) {
          params[config.parameter] = value;
        }
        const res = await api.get<any>(config.endpoint, { params });
        console.log("hannnn : ", res.data);
        const data = config.transformResponse
          ? config.transformResponse(res.data)
          : Array.isArray(res.data)
            ? res.data.map((item: any) => ({ label: item.toString(), value: item.toString() }))
            : [];
        setOptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [field.step, field.service, field.field, value, JSON.stringify(allValues)]);

  return { options, loading, error };
};

export const ConfigField = ({ field, value, onChange, fallback, allValues }: Props) => {
  const { options, loading, error } = useDynamicOptions(field, value, allValues);

  if (loading) {
    return (
      <select disabled className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-100 transition-all bg-gray-50 text-gray-500">
        <option>Chargement...</option>
      </select>
    );
  }

  if (error || !options || !Array.isArray(options) || options.length === 0) {
    return <>{fallback}</>;
  }

  return (
    <select
      name={field.field}
      required={field.required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-100 transition-all bg-white text-gray-900"
    >
      <option value="">Select {field.label}...</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};