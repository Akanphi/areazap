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
}

// Configuration centralisée des endpoints
export type SelectOption = {
  label: string;
  value: string;
};

type EndpointConfig = {
  endpoint: string;
  transformResponse?: (data: any) => SelectOption[];
};

const FIELD_ENDPOINTS: Record<string, Record<string, Record<string, EndpointConfig>>> = {
  trigger: {
    github: {
      repository: {
        endpoint: "/github/repos/",
        transformResponse: (data: any) => (data.repos || []).map((repo: string) => ({ label: repo, value: repo }))
      },
    },
    gitlab: {
      project_id: {
        endpoint: "/gitlab/projects/",
        transformResponse: (data: any) => (Array.isArray(data) ? data : []).map((p: any) => ({
          label: p.name || p.id?.toString() || p.toString(),
          value: p.id?.toString() || p.toString()
        }))
      },
    },
  },
  action: {
    github: {
      repository: {
        endpoint: "/github/repos/",
        transformResponse: (data: any) => (data.repos || []).map((repo: string) => ({ label: repo, value: repo }))
      },
      assignee: {
        endpoint: "/github/users/",
        transformResponse: (data: any) => (Array.isArray(data) ? data : []).map((u: any) => ({ label: u.login || u, value: u.login || u }))
      },
      issue: { endpoint: "/github/user/issues/" },
      branch: { endpoint: "/github/branches/" },
      pulls: { endpoint: "/github/user/pulls/" },
    },
    gitlab: {
      project_id: {
        endpoint: "/gitlab/projects/",
        transformResponse: (data: any) => (Array.isArray(data) ? data : []).map((p: any) => ({
          label: p.name || p.id?.toString() || p.toString(),
          value: p.id?.toString() || p.toString()
        }))
      },
      assignee: { endpoint: "/gitlab/users/" },
      branches: { endpoint: "/gitlab/user/branches/" },
      issues: { endpoint: "/gitlab/user/issues/" },
      merge_request: { endpoint: "/gitlab/user/merge-requests/" },
    },
    slack: {
      channel: {
        endpoint: "/slack/channels/",
        transformResponse: (data: any) => (Array.isArray(data) ? data : []).map((c: any) => ({ label: c.name || c, value: c.id || c }))
      },
      emojis: { endpoint: "/slack/emojis/" },
      messages: { endpoint: "/slack/messages/" },
      users: { endpoint: "/slack/users/" }
    },
    todoist: {
      project_id: {
        endpoint: "/todoist/projects/",
        transformResponse: (data: any) => {
          console.log("Todoist Projects Raw Data:", data);
          const projects = data.projects || data;
          return (Array.isArray(projects) ? projects : []).map((p: any) => ({
            label: p.name || p.full_name || p.id?.toString() || p.toString(),
            value: p.id?.toString() || p.toString()
          }));
        }
      },
      task: {
        endpoint: "/todoist/tasks/",
        transformResponse: (data: any) => {
          console.log("Todoist Tasks Raw Data:", data);
          const tasks = data.tasks || data;
          return (Array.isArray(tasks) ? tasks : []).map((t: any) => ({
            label: t.content || t.name || t.id?.toString() || t.toString(),
            value: t.id?.toString() || t.toString()
          }));
        }
      },
    }
  },
};

// Hook personnalisé pour récupérer les options dynamiques
const useDynamicOptions = (field: ConfigMap) => {
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
        const res = await api.get<any>(config.endpoint);
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
  }, [field.step, field.service, field.field]);

  return { options, loading, error };
};

export const ConfigField = ({ field, value, onChange, fallback }: Props) => {
  const { options, loading, error } = useDynamicOptions(field);

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