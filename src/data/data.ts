export const availablecatego = [
  {
    "Communications": [
      "/gmail.svg",
      "/outlook.svg",
      "/slack.svg",
      "/teams.svg",
      "/discord.svg",
      "/telegram.svg"
    ]
  },
  {
    "Project Management": [
      "/trello.svg",
      "/asana.svg",
      "/notion.svg",
      "/monday.svg",
      "/jira.svg",
      "/clickup.svg"
    ]
  },
  {
    "Productivity": [
      "/google-sheets.svg",
      "/airtable.svg",
      "/excel.svg",
      "/evernote.svg",
      "/todoist.svg"
    ]
  },
  {
    "CRM & Sales": [
      "/hubspot.svg",
      "/salesforce.svg",
      "/pipedrive.svg",
      "/zoho.svg"
    ]
  },
  {
    "Payment & Finance": [
      "/stripe.svg",
      "/paypal.svg",
      "/quickbooks.svg",
      "/xero.svg"
    ]
  },
  {
    "Social Media": [
      "/twitter.svg",
      "/linkedin.svg",
      "/facebook.svg",
      "/instagram.svg",
      "/youtube.svg"
    ]
  },
  {
    "Storage": [
      "/google-drive.svg",
      "/dropbox.svg",
      "/onedrive.svg",
      "/box.svg"
    ]
  },
  {
    "Email Marketing": [
      "/mailchimp.svg",
      "/sendgrid.svg",
      "/convertkit.svg",
      "/activecampaign.svg"
    ]
  }
];

export const mockDashboardData = {
  totalZaps: 42,
  activeZaps: 35,
  totalExecutions: 125680,
  successRate: 98.5,
  avgExecutionTime: 1.2
};

export const mockZapsByCategory = [
  { name: "Data Sync", count: 12, percentage: 28.6, executions: 45000, color: "#C174F2" },
  { name: "Notifications", count: 10, percentage: 23.8, executions: 38000, color: "#D5A8F2" },
  { name: "CRM Updates", count: 8, percentage: 19.0, executions: 22000, color: "#E4BEF8" },
  { name: "Email Automation", count: 6, percentage: 14.3, executions: 12000, color: "#F18585" },
  { name: "File Management", count: 4, percentage: 9.5, executions: 6000, color: "#F49C9C" },
  { name: "Others", count: 2, percentage: 4.8, executions: 2680, color: "#F6AEAE" }
];

export const mockExecutionsByApp = [
  { name: "Slack", value: 28000, zaps: 8, color: "#C174F2" },
  { name: "Gmail", value: 24000, zaps: 6, color: "#D5A8F2" },
  { name: "Google Sheets", value: 20000, zaps: 7, color: "#E4BEF8" },
  { name: "Salesforce", value: 18000, zaps: 5, color: "#F18585" },
  { name: "Trello", value: 15000, zaps: 4, color: "#F49C9C" },
  { name: "Others", value: 20680, zaps: 12, color: "#F6AEAE" }
];

export const mockExecutionTimeline = [
  { month: "Jan", executions: 8500, successful: 8330, successRate: 98.0 },
  { month: "Feb", executions: 10200, successful: 10045, successRate: 98.5 },
  { month: "Mar", executions: 14500, successful: 14355, successRate: 99.0 },
  { month: "Apr", executions: 18200, successful: 17927, successRate: 98.5 },
  { month: "May", executions: 21000, successful: 20685, successRate: 98.5 },
  { month: "Jun", executions: 24500, successful: 24132, successRate: 98.5 },
  { month: "Jul", executions: 28300, successful: 27876, successRate: 98.5 },
  { month: "Aug", executions: 30500, successful: 30042, successRate: 98.5 }
];

export const mockTopPerformers = [
  {
    name: "Daily Sales Report",
    executions: 8640,
    successRate: 99.8,
    avgTime: 0.8,
    trend: "up",
    logo: "DS",
    category: "Data Sync",
    status: "Active"
  },
  {
    name: "Customer Onboarding",
    executions: 6200,
    successRate: 99.5,
    avgTime: 1.2,
    trend: "up",
    logo: "CO",
    category: "CRM Updates",
    status: "Active"
  },
  {
    name: "Invoice Processing",
    executions: 5800,
    successRate: 98.9,
    avgTime: 1.5,
    trend: "up",
    logo: "IP",
    category: "File Management",
    status: "Active"
  },
  {
    name: "Support Ticket Alert",
    executions: 4500,
    successRate: 97.2,
    avgTime: 2.1,
    trend: "down",
    logo: "ST",
    category: "Notifications",
    status: "Active"
  }
];

export const availableApps = [
  { id: "github", name: "GitHub", icon: "/github.svg", color: "#333333" },
  { id: "gmail", name: "Gmail", icon: "/gmail.svg", color: "#EA4335" },
];


export const appTriggers: Record<string, string[]> = {
  github: ["New Issue"],
};


export const appActions: Record<string, string[]> = {
  gmail: ["Send Email"],
};

export const mockZaps = [
  {
    id: "1",
    name: "Daily Sales Report",
    description: "Automatically send daily sales summary to Slack",
    status: "active",
    category: "Data Sync",
    apps: ["Google Sheets", "Slack"],
    executions: 8640,
    successRate: 99.8,
    lastRun: "2 minutes ago",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Customer Onboarding",
    description: "Add new customers to CRM and send welcome email",
    status: "active",
    category: "CRM Updates",
    apps: ["Gmail", "Salesforce"],
    executions: 6200,
    successRate: 99.5,
    lastRun: "15 minutes ago",
    createdAt: "2024-02-10",
  },
  {
    id: "3",
    name: "Invoice Processing",
    description: "Process invoices and update accounting system",
    status: "active",
    category: "File Management",
    apps: ["Google Drive", "QuickBooks"],
    executions: 5800,
    successRate: 98.9,
    lastRun: "1 hour ago",
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Support Ticket Alert",
    description: "Notify team when high-priority tickets are created",
    status: "inactive",
    category: "Notifications",
    apps: ["Zendesk", "Slack"],
    executions: 4500,
    successRate: 97.2,
    lastRun: "3 hours ago",
    createdAt: "2024-03-05",
  },
  {
    id: "5",
    name: "Lead Capture",
    description: "Capture leads from website forms to CRM",
    status: "active",
    category: "CRM Updates",
    apps: ["Webflow", "HubSpot"],
    executions: 7200,
    successRate: 99.1,
    lastRun: "5 minutes ago",
    createdAt: "2024-02-01",
  },
  {
    id: "6",
    name: "Social Media Scheduler",
    description: "Schedule and post content across social platforms",
    status: "active",
    category: "Marketing",
    apps: ["Buffer", "Twitter"],
    executions: 3400,
    successRate: 98.5,
    lastRun: "30 minutes ago",
    createdAt: "2024-03-15",
  },
  {
    id: "7",
    name: "Expense Tracker",
    description: "Track expenses from receipts to accounting",
    status: "draft",
    category: "Finance",
    apps: ["Gmail", "Xero"],
    executions: 0,
    successRate: 0,
    lastRun: "Never",
    createdAt: "2024-04-01",
  },
  {
    id: "8",
    name: "Meeting Notes Sync",
    description: "Sync meeting notes to project management tool",
    status: "active",
    category: "Productivity",
    apps: ["Google Meet", "Notion"],
    executions: 2100,
    successRate: 99.9,
    lastRun: "10 minutes ago",
    createdAt: "2024-02-20",
  },
  {
    id: "9",
    name: "Inventory Alert",
    description: "Alert when inventory levels are low",
    status: "active",
    category: "Notifications",
    apps: ["Shopify", "Slack"],
    executions: 1800,
    successRate: 100,
    lastRun: "2 hours ago",
    createdAt: "2024-03-10",
  },
  {
    id: "10",
    name: "Email Newsletter",
    description: "Send weekly newsletter to subscribers",
    status: "inactive",
    category: "Marketing",
    apps: ["Mailchimp", "WordPress"],
    executions: 520,
    successRate: 96.8,
    lastRun: "1 week ago",
    createdAt: "2024-01-05",
  },
  {
    id: "11",
    name: "Task Assignment",
    description: "Auto-assign tasks based on team availability",
    status: "active",
    category: "Productivity",
    apps: ["Asana", "Slack"],
    executions: 4900,
    successRate: 98.2,
    lastRun: "20 minutes ago",
    createdAt: "2024-02-15",
  },
  {
    id: "12",
    name: "Payment Reminder",
    description: "Send payment reminders to clients",
    status: "active",
    category: "Finance",
    apps: ["Stripe", "Gmail"],
    executions: 3200,
    successRate: 99.4,
    lastRun: "1 hour ago",
    createdAt: "2024-03-01",
  },
];