export interface ServiceConfig {
    provider: string;
    name: string;
    description: string;
    icon: string;
    color: string;
}

export const AVAILABLE_SERVICES: ServiceConfig[] = [
    {
        provider: "google",
        name: "Google",
        description: "Send and receive emails, manage your inbox",
        icon: "/google.svg",
        color: "from-gray-500 to-black-500",
    },
    {
        provider: "github",
        name: "GitHub",
        description: "Manage repositories, issues, and pull requests",
        icon: "/github.svg",
        color: "from-gray-700 to-gray-900",
    },
    {
        provider: "slack",
        name: "Slack",
        description: "Send messages and manage channels",
        icon: "/slack.svg",
        color: "from-green-700 to-gray-500",
    },
    {
        provider: "todoist",
        name: "Todoist",
        description: "Manage your tasks and projects",
        icon: "/todoist.svg",
        color: "from-blue-500 to-blue-700",
    },
    {
        provider: "gitlab",
        name: "GitLab",
        description: "Manage repositories, issues, and pull requests",
        icon: "/gitlab.svg",
        color: "from-gray-700 to-gray-900",
    }
];
