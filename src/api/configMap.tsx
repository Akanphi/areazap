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
type EndpointConfig = {
  endpoint: string;
  transformResponse?: (data: any) => string[];
};

const FIELD_ENDPOINTS: Record<string, Record<string, Record<string, EndpointConfig>>> = {
  trigger: {
    github: {
      repository: {
        endpoint: "/github/repos/",
        transformResponse: (data: any) => data.repos
      },
    },
    gitlab: {
      project_id: { endpoint: "/gitlab/projects/" },
    },
  },
  action: {
    github: {
      repository: {
        endpoint: "/github/repos/",
        transformResponse: (data: any) => data.repos
      },
      assignee: { endpoint: "/github/users/" },
      issue: { endpoint: "/github/user/issues/" },
      branch: { endpoint: "/github/branches/" },
      pulls: { endpoint: "/github/user/pulls/" },
    },
    gitlab: {
      project_id: { endpoint: "/gitlab/projects/" },
      assignee: { endpoint: "/gitlab/users/" },
      branches: { endpoint: "/gitlab/user/branches/" },
      issues: { endpoint: "/gitlab/user/issues/" },
      merge_request: { endpoint: "/gitlab/user/merge-requests/" },
    },
    slack: {
      channel: { endpoint: "/slack/channels/" },
      emojis: {endpoint: "/slack/emojis/"},
      messages: {endpoint: "/slack/messages/"},
      users: {endpoint: "/slack/users/"}
    },
  },
};

// Hook personnalisé pour récupérer les options dynamiques
const useDynamicOptions = (field: ConfigMap) => {
  const [options, setOptions] = useState<string[]>([]);
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
        const res = await api.get<string[]>(config.endpoint);
        const data = config.transformResponse
          ? config.transformResponse(res.data)
          : res.data;
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
  console.log("le retour est :", options);
  if (error || !options || !Array.isArray(options) || options.length === 0) {
    if (!Array.isArray(options) && options) {
      console.warn("ConfigField: options is not an array:", options);
    }
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
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};