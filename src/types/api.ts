// ============================================
// TYPES DE BASE
// ============================================

type AppId = string; // 'gmail', 'slack', 'asana', etc.
type EventId = string; // 'new_email', 'new_message', etc.
type ZapId = string;
type StepId = string;
type ConnectionId = string;

// ============================================
// APPLICATION & INTÉGRATIONS
// ============================================

interface App {
  id: AppId;
  name: string;
  description: string;
  logoUrl: string;
  category: 'communication' | 'productivity' | 'crm' | 'marketing' | 'storage' | 'other';
  authType: 'oauth2' | 'apikey' | 'basic';
  isPopular: boolean;
  triggers: TriggerDefinition[];
  actions: ActionDefinition[];
}

export interface TriggerDefinition {
  slug: string;
  name?: string;
  description: string;
  type?: 'polling' | 'webhook' | 'instant';
  inputFields?: FieldDefinition[];
  outputFields?: FieldDefinition[];
  testable?: boolean;
  id?: string; // Optional fallback
}

export interface ActionDefinition {
  slug: string;
  name?: string;
  description: string;
  inputFields?: FieldDefinition[];
  outputFields?: FieldDefinition[];
  testable?: boolean;
  id?: string; // Optional fallback
}

// ============================================
// DÉFINITION DES CHAMPS
// ============================================

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  description?: string;
  placeholder?: string;
  defaultValue?: any;
  choices?: FieldChoice[]; // Pour les dropdowns
  dynamic?: boolean; // Si les options viennent d'une API
  helpText?: string;
}

type FieldType =
  | 'string'
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'email'
  | 'url'
  | 'dropdown'
  | 'multiselect'
  | 'file';

export interface FieldChoice {
  label: string;
  value: string | number;
}

// ============================================
// CONNECTION / AUTHENTIFICATION
// ============================================

interface Connection {
  id: ConnectionId;
  appId: AppId;
  accountName: string; // "john@gmail.com"
  accountId?: string;
  authType: 'oauth2' | 'apikey' | 'basic';
  credentials: OAuth2Credentials | ApiKeyCredentials | BasicCredentials;
  isValid: boolean;
  createdAt: Date;
  lastTestedAt?: Date;
}

interface OAuth2Credentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scope?: string[];
}

interface ApiKeyCredentials {
  apiKey: string;
  additionalFields?: Record<string, string>;
}

interface BasicCredentials {
  username: string;
  password: string;
}

// ============================================
// ZAP (l'automatisation complète)
// ============================================

interface Zap {
  id: ZapId;
  name: string;
  userId: string;
  status: 'active' | 'paused' | 'draft' | 'error';
  trigger: TriggerStep;
  actions: ActionStep[];
  createdAt: Date;
  updatedAt: Date;
  lastRunAt?: Date;
  runCount: number;
  errorCount: number;
  folder?: string;
  tags?: string[];
}

// ============================================
// STEPS (Trigger & Actions)
// ============================================

interface BaseStep {
  id: StepId;
  appId: AppId;
  eventId: EventId;
  connectionId: ConnectionId;
  label?: string; // Nom personnalisé de l'étape
  position: number;
  config: StepConfig;
  testData?: any; // Données de test récupérées
  lastTestedAt?: Date;
  testStatus?: 'success' | 'error' | 'pending';
  testError?: string;
}

interface TriggerStep extends BaseStep {
  type: 'trigger';
  filters?: Filter[]; // Conditions sur le trigger
}

interface ActionStep extends BaseStep {
  type: 'action';
  fieldMapping: FieldMapping;
}

// ============================================
// CONFIGURATION & MAPPING
// ============================================

interface StepConfig {
  // Configuration spécifique à l'app
  // Ex pour Gmail: { labelId: 'INBOX', query: 'is:unread' }
  // Ex pour Sheets: { spreadsheetId: '123', worksheetId: 'Sheet1' }
  [key: string]: any;
}

interface FieldMapping {
  // Mapping entre les champs de l'action et les valeurs
  [fieldKey: string]: FieldValue;
}

type FieldValue =
  | string // Valeur statique: "Hello World"
  | FieldReference // Référence dynamique: {{trigger.email.subject}}
  | MixedValue; // Mix: "Hello {{trigger.name}}"

interface FieldReference {
  type: 'reference';
  stepId: StepId; // 'trigger' ou l'ID de l'action
  path: string; // 'email.subject' ou 'contact.name'
}

interface MixedValue {
  type: 'mixed';
  parts: (string | FieldReference)[];
}

// ============================================
// FILTRES & CONDITIONS
// ============================================

interface Filter {
  id: string;
  field: FieldReference;
  operator: FilterOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR'; // Pour chaîner plusieurs filtres
}

type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'is_empty'
  | 'is_not_empty';

// ============================================
// EXÉCUTION & HISTORIQUE
// ============================================

interface ZapRun {
  id: string;
  zapId: ZapId;
  status: 'success' | 'error' | 'running' | 'filtered';
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // en millisecondes
  triggerData: any;
  steps: StepRun[];
  error?: ExecutionError;
}

interface StepRun {
  stepId: StepId;
  stepType: 'trigger' | 'action';
  status: 'success' | 'error' | 'skipped';
  startedAt: Date;
  completedAt?: Date;
  inputData: any;
  outputData?: any;
  error?: ExecutionError;
}

interface ExecutionError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// ============================================
// DONNÉES DISPONIBLES (pour le mapping)
// ============================================

interface AvailableData {
  trigger: DataSchema;
  actions: Record<StepId, DataSchema>;
}

interface DataSchema {
  [key: string]: DataField;
}

interface DataField {
  label: string;
  type: FieldType;
  value?: any; // Exemple de valeur
  children?: DataSchema; // Pour les objets imbriqués
}

// ============================================
// ÉTAT UI DE L'ÉDITEUR
// ============================================

interface EditorState {
  zap: Zap;
  isDirty: boolean; // Changements non sauvegardés
  isSaving: boolean;
  lastSaved?: Date;
  activeStep?: StepId; // Étape en cours d'édition
  validationErrors: ValidationError[];
  availableApps: App[];
  userConnections: Connection[];
}

interface ValidationError {
  stepId: StepId;
  fieldKey?: string;
  message: string;
  severity: 'error' | 'warning';
}

// ============================================
// TEMPLATES DE ZAP (optionnel mais utile)
// ============================================

interface ZapTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  popularity: number;
  triggerApp: AppId;
  actionApps: AppId[];
  template: Omit<Zap, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
  thumbnail?: string;
}

// ============================================
// STATISTIQUES (pour le dashboard)
// ============================================

interface ZapStats {
  zapId: ZapId;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  lastRun?: Date;
  avgExecutionTime: number;
  last7Days: DailyStats[];
}

interface DailyStats {
  date: string;
  runs: number;
  successes: number;
  errors: number;
}

// ============================================
// USER & BILLING (aperçu)
// ============================================

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'starter' | 'professional' | 'team';
  limits: {
    maxZaps: number;
    maxTasksPerMonth: number;
    maxStepsPerZap: number;
  };
  usage: {
    currentZaps: number;
    tasksThisMonth: number;
  };
}

export interface AlertPopProps {
  message: string;
  onClose: () => void;
  isVisible: boolean;
  autoHideDuration?: number;
}

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading';
  onConfirm?: () => void;
  confirmText?: string;
}
// ============================================
// Available automation category
// ============================================
// ============================================
// EXTERNAL SERVICES & TRIGGERS
// ============================================

export interface ExternalService {
  id: string;
  name: string;
  slug: string;
  auth_type: string;
  logo_url: string | null;
  capabilities: Record<string, any>;
}

export interface ServiceDefinition {
  triggers: TriggerDefinition[];
  actions: ActionDefinition[];
}

export type TriggerConfig = FieldDefinition[];

export interface ConfigMap {
  step: string;
  service: string;
  field: string;
  label: string;
  type: "select" | "text" | "number";
  required: boolean;
}
