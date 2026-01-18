"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
    ArrowLeft,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Save,
    Rocket,
    Zap,
    Settings,
    CheckCircle,
    Loader2,
    AlertCircle,
    Check,
    X
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { createArea, patchArea, getArea, validateArea, AreaStatus } from "@/api/areas";
import api from "@/api/api";
import { getExternalServices, getServiceDefinitions, handleOAuthCallback, requestConsent } from "@/api/services";
import { getTriggerConfig } from "@/api/triggers";
import { createAreaTrigger, authorizeAreaTrigger, patchAreaTrigger, deleteAreaTrigger } from "@/api/areaTriggers";
import { createAreaAction, authorizeAreaAction, patchAreaAction, deleteAreaAction } from "@/api/areaActions";
import { getServiceAccounts, ServiceAccount, getConnectedServices } from "@/api/serviceAccounts";
import { ExternalService, TriggerDefinition, ActionDefinition, ServiceDefinition, TriggerConfig, FieldDefinition, FieldChoice } from "@/types/api";
import { ConfigField, ConfigMap } from "@/api/configMap";
// Disable static generation for this page
export const dynamic = 'force-dynamic';
// Removed mock data


/** * COMPOSANT ALERTP POP (Intégré pour éviter l'erreur d'import)
 */
const AlertPop = ({ message, isVisible, onClose, autoHideDuration = 5000, isError = false }: any) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, autoHideDuration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, autoHideDuration]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className={`${isError ? 'bg-red-600' : 'bg-gray-900'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${isError ? 'border-red-500' : 'border-gray-700'}`}>
                {isError ? <AlertCircle className="w-5 h-5 text-white" /> : <CheckCircle className="w-5 h-5 text-[#07BB9C]" />}
                <span className="font-medium">{message}</span>
                <button onClick={onClose} className="ml-2 hover:bg-black/20 p-1 rounded-full transition-colors">
                    <X className="w-4 h-4 text-white/80" />
                </button>
            </div>
        </div>
    );
};


interface Step {
    id: string;
    type: "trigger" | "reaction";
    app: string;
    event: string;
    isExpanded: boolean;
    config: Record<string, any>;
    isCheckingAuth?: boolean;
    isConnected?: boolean;
    createdId?: string;
    isCreating?: boolean;
    createError?: string;
    isValidated?: boolean;
    isValidating?: boolean;
    consentMessage?: string;
}

const AppSelect = ({
    value,
    onChange,
    options,
    isLoading = false,
    disabled = false
}: {
    value: string;
    onChange: (value: string) => void;
    options: ExternalService[];
    isLoading?: boolean;
    disabled?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedApp = options.find((app) => app.slug === value);

    return (
        <div className="relative">
            {isOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            )}
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled || isLoading}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-left flex items-center justify-between bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex items-center gap-3">
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                            <span className="text-gray-500">Vérification de la connexion...</span>
                        </>
                    ) : selectedApp ? (
                        <>
                            <img src={selectedApp.logo_url || `/${selectedApp.slug}.svg`} alt={selectedApp.name} className="w-6 h-6 object-contain" />
                            <span className="text-gray-900">{selectedApp.name}</span>
                        </>
                    ) : (
                        <span className="text-gray-500">Select an app...</span>
                    )}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {options.map((app) => (
                        <div
                            key={app.id}
                            onClick={() => {
                                onChange(app.slug);
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                        >
                            <img src={app.logo_url || `/${app.slug}.svg`} alt={app.name} className="w-6 h-6 object-contain" />
                            <span className="font-medium text-gray-700">{app.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

function ZapsEditorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const areaIdParam = searchParams.get("id");

    const [zapName, setZapName] = useState("Untitled Area");
    const [zapDescription, setZapDescription] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ isVisible: false, message: "", isError: false });

    // Dynamic Data State
    const [services, setServices] = useState<ExternalService[]>([]);
    const [serviceDefinitions, setServiceDefinitions] = useState<Record<string, ServiceDefinition>>({});
    const [triggerConfigs, setTriggerConfigs] = useState<Record<string, any>>({});
    const [isLoadingServices, setIsLoadingServices] = useState(false);

    const [serviceAccounts, setServiceAccounts] = useState<ServiceAccount[]>([]);
    const [connectedServices, setConnectedServices] = useState<ExternalService[]>([]);

    // Consent State
    const [consentModal, setConsentModal] = useState<{ isOpen: boolean; serviceSlug: string; stepId: string }>({
        isOpen: false,
        serviceSlug: "",
        stepId: ""
    });

    // États Workflow
    const [currentAreaId, setCurrentAreaId] = useState<string | null>(null);
    const [isCreatingArea, setIsCreatingArea] = useState(false);

    const [steps, setSteps] = useState<Step[]>([
        {
            id: "trigger-1",
            type: "trigger",
            app: "",
            event: "",
            isExpanded: true,
            config: {},
        },
    ]);

    // Fetch services on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingServices(true);
            try {
                const [servicesData, accountsData, connectedData] = await Promise.all([
                    getExternalServices(),
                    getServiceAccounts(),
                    getConnectedServices()
                ]);
                setServices(servicesData);
                setServiceAccounts(accountsData);
                setConnectedServices(connectedData);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                showAlert("Failed to load services or accounts.");
            } finally {
                setIsLoadingServices(false);
            }
        };
        fetchData();
    }, []);

    // Fetch area details if ID is present
    useEffect(() => {
        const fetchAreaDetails = async () => {
            if (!areaIdParam) return;

            try {
                const area = await getArea(areaIdParam);
                console.log("Fetched area details:", area);
                setCurrentAreaId(area.id);
                setZapName(area.name);
                setZapDescription(area.description || "");

                // Map triggers and actions to steps
                const newSteps: Step[] = [];
                const newServiceDefinitions: Record<string, ServiceDefinition> = {};
                const newTriggerConfigs: Record<string, any> = {};

                // Helper to fetch definitions and configs for a step
                const processStepData = async (appSlug: string, eventSlug: string, type: "trigger" | "reaction") => {
                    if (!appSlug || !eventSlug) return;

                    try {
                        // Fetch service definitions if not already fetched
                        if (!newServiceDefinitions[appSlug] && !serviceDefinitions[appSlug]) {
                            const definitions = await getServiceDefinitions(appSlug);
                            newServiceDefinitions[appSlug] = definitions;
                        }

                        const serviceDef = newServiceDefinitions[appSlug] || serviceDefinitions[appSlug];
                        if (serviceDef) {
                            const definition = type === "trigger"
                                ? serviceDef.triggers.find((t: TriggerDefinition) => t.slug === eventSlug)
                                : serviceDef.actions.find((a: ActionDefinition) => a.slug === eventSlug);

                            if (definition && definition.inputFields && definition.inputFields.length > 0) {
                                newTriggerConfigs[eventSlug] = definition.inputFields;
                            } else {
                                try {
                                    const endpoint = type === "trigger" ? "area-triggers" : "area-actions";
                                    const response = await api.get(`${endpoint}/config/${eventSlug}/`);
                                    newTriggerConfigs[eventSlug] = response.data || [];
                                } catch (error) {
                                    console.error(`Failed to fetch config for ${type} ${eventSlug}:`, error);
                                    newTriggerConfigs[eventSlug] = [];
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Failed to fetch data for ${type} ${eventSlug}:`, error);
                    }
                };

                // Map triggers
                if (area.triggers && area.triggers.length > 0) {
                    for (const [index, trigger] of area.triggers.entries()) {
                        const app = trigger.external_service || "";
                        const event = trigger.event_type || "";

                        await processStepData(app, event, "trigger");

                        newSteps.push({
                            id: `trigger-${index + 1}`,
                            type: "trigger",
                            app,
                            event,
                            isExpanded: false,
                            config: trigger.config || {},
                            isConnected: true,
                            createdId: trigger.id,
                            isValidated: true
                        });
                    }
                } else {
                    newSteps.push({
                        id: "trigger-1",
                        type: "trigger",
                        app: "",
                        event: "",
                        isExpanded: true,
                        config: {},
                    });
                }

                // Map actions
                if (area.actions && area.actions.length > 0) {
                    const sortedActions = [...area.actions].sort((a, b) => a.order_index - b.order_index);
                    for (const [index, action] of sortedActions.entries()) {
                        const app = action.external_service || "";
                        const event = action.action_type || "";

                        await processStepData(app, event, "reaction");

                        newSteps.push({
                            id: `action-${index + 1}`,
                            type: "reaction",
                            app,
                            event,
                            isExpanded: false,
                            config: action.config || {},
                            isConnected: true,
                            createdId: action.id,
                            isValidated: true
                        });
                    }
                }

                setServiceDefinitions(prev => ({ ...prev, ...newServiceDefinitions }));
                setTriggerConfigs(prev => ({ ...prev, ...newTriggerConfigs }));
                setSteps(newSteps);
            } catch (error) {
                console.error("Failed to fetch area details:", error);
                showAlert("Failed to load area details.");
            }
        };

        fetchAreaDetails();
    }, [areaIdParam]);

    // Listen for messages from OAuth popup
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'oauth_success') {
                showAlert(`Successfully connected to ${event.data.service || 'service'}!`);
                // Refresh dynamic data for the current app
                const currentStep = steps.find(s => s.isExpanded);
                if (currentStep) {
                    // Refresh service accounts and connected services
                    Promise.all([
                        getServiceAccounts(),
                        getConnectedServices()
                    ]).then(([accounts, connected]) => {
                        setServiceAccounts(accounts);
                        setConnectedServices(connected);
                    }).catch(console.error);
                    // Mark step as validated if it was waiting for auth
                    if (!currentStep.isValidated && currentStep.createdId) {
                        updateStep(currentStep.id, { isValidated: true });
                    }
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [steps]);

    // Handle OAuth callback in same window
    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (code && state) {
            const processCallback = async () => {
                try {
                    const data = await handleOAuthCallback({ code, state });
                    if (data.success) {
                        showAlert(data.message || 'Service authorized successfully!');
                        // Refresh dynamic data
                        const currentStep = steps.find(s => s.isExpanded);
                        if (currentStep) {
                            // Mark step as validated if it was waiting for auth
                            if (!currentStep.isValidated && currentStep.createdId) {
                                updateStep(currentStep.id, { isValidated: true });
                            }
                        }
                    } else {
                        showAlert('Authorization failed: ' + (data.message || 'Unknown error'));
                    }
                    // Clean URL
                    router.replace('/area-editor');
                } catch (error) {
                    console.error('OAuth callback error:', error);
                    showAlert('An error occurred during authorization');
                }
            };
            processCallback();
        }
    }, [searchParams, router, steps]);

    const showAlert = (message: string, isError: boolean = false) => {
        setAlertConfig({ isVisible: true, message, isError });
    };

    const addStep = (type: "reaction") => {
        const newReaction: Step = {
            id: `step-${steps.length + 1}`,
            type,
            app: "",
            event: "",
            isExpanded: true,
            config: {},
        };
        setSteps((prev) => [...prev, newReaction]);
    };

    const removeStep = async (stepId: string) => {
        const step = steps.find(s => s.id === stepId);

        // Prevent deletion of the last trigger
        if (step?.type === "trigger") {
            const triggerCount = steps.filter(s => s.type === "trigger").length;
            if (triggerCount <= 1) {
                showAlert("Cannot delete the last trigger. An AREA must have at least one trigger.", true);
                return;
            }
        }

        if (step?.createdId) {
            try {
                if (step.type === "trigger") {
                    await deleteAreaTrigger(step.createdId);
                } else {
                    await deleteAreaAction(step.createdId);
                }
                showAlert(`${step.type} deleted successfully!`);
            } catch (error) {
                console.error("Failed to delete step:", error);
                showAlert("Failed to delete step from backend.");
                // Don't remove from UI if backend deletion fails? 
                // Or remove anyway? Let's remove anyway for now to keep UI responsive, 
                // but maybe we should block if it fails.
                // For now, let's proceed with UI removal.
            }
        }
        setSteps((prev) => prev.filter((step) => step.id !== stepId));
    };

    const updateStep = (stepId: string, updates: Partial<Step>) => {
        setSteps((prev) =>
            prev.map((step) =>
                step.id === stepId ? { ...step, ...updates } : step
            )
        );
    };

    const handleAppChange = async (stepId: string, appSlug: string) => {
        // Always open consent modal as requested by the user
        setConsentModal({
            isOpen: true,
            serviceSlug: appSlug,
            stepId: stepId
        });
    };

    const proceedWithService = async (stepId: string, serviceSlug: string) => {
        updateStep(stepId, {
            app: serviceSlug,
            event: "",
            isExpanded: true,
            isCheckingAuth: true,
            isConnected: false,
            isValidated: false,
            config: {}
        });

        // Fetch definitions for the selected service
        if (!serviceDefinitions[serviceSlug]) {
            const definitions = await getServiceDefinitions(serviceSlug);
            console.log("Fetched definitions for", serviceSlug, ":", definitions);
            setServiceDefinitions(prev => ({ ...prev, [serviceSlug]: definitions }));
        } else {
            console.log("Using cached definitions for", serviceSlug, ":", serviceDefinitions[serviceSlug]);
        }

        updateStep(stepId, {
            isCheckingAuth: false,
            isConnected: true
        });
    };

    const handleConsentConfirm = async () => {
        const { serviceSlug, stepId } = consentModal;
        setConsentModal({ isOpen: false, serviceSlug: "", stepId: "" });

        if (!serviceSlug || !stepId) return;

        try {
            console.log(`Requesting consent for ${serviceSlug}...`);

            if (serviceSlug === "google") {
                await proceedWithService(stepId, serviceSlug);
                return;
            }

            const response = await requestConsent(serviceSlug);
            console.log("Consent response:", response);

            if (response.is_authenticated) {
                await proceedWithService(stepId, serviceSlug);
            } else if (response.authorization_url) {
                // Redirect to auth url
                window.open(response.authorization_url, '_blank');
                updateStep(stepId, {
                    consentMessage: "Get back and select the service again once you've connected to your service."
                });
                showAlert("Please complete authentication in the popup.");
            } else {
                showAlert("Service requires authentication but no URL was provided.");
            }

        } catch (error) {
            console.error("Consent request failed:", error);
            showAlert("Failed to process consent.");
        }
    };

    const handleAreaNameSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!zapName.trim() || isCreatingArea || currentAreaId) return;

        setIsCreatingArea(true);
        try {
            const newArea = await createArea({
                name: zapName,
                status: AreaStatus.DRAFT,
                description: zapDescription || null
            });
            console.log("Created new area:", newArea);
            setCurrentAreaId(newArea.id);
            setIsEditingName(false);
            showAlert("Area created successfully!");
        } catch (error) {
            console.error("Failed to create area:", error);
            showAlert("Failed to create area. Please try again.");
        } finally {
            setIsCreatingArea(false);
        }
    };

    const handleEventSelect = async (stepId: string, event: string) => {
        const step = steps.find((s) => s.id === stepId);
        if (!step) return;

        if (!currentAreaId) {
            updateStep(stepId, { createError: "Please create an area first" });
            return;
        }

        updateStep(stepId, { event, isExpanded: true, isCreating: true, createError: undefined, isValidated: false, config: {} });

        try {
            // 1. Fetch Config
            const serviceDef = serviceDefinitions[step.app];
            if (serviceDef) {
                const definition = step.type === "trigger"
                    ? serviceDef.triggers.find((t: TriggerDefinition) => t.slug === event)
                    : serviceDef.actions.find((a: ActionDefinition) => a.slug === event);

                if (definition && definition.inputFields && definition.inputFields.length > 0) {
                    setTriggerConfigs(prev => ({ ...prev, [event]: definition.inputFields }));
                } else {
                    try {
                        // Try to fetch config from backend for both triggers and actions
                        const endpoint = step.type === "trigger" ? "area-triggers" : "area-actions";
                        const response = await api.get(`${endpoint}/config/${event}/`);
                        console.log(`Fetched config for ${step.type} ${event}:`, response.data);
                        setTriggerConfigs(prev => ({ ...prev, [event]: response.data || [] }));
                    } catch (error) {
                        console.error(`Failed to fetch config for ${step.type} ${event}:`, error);
                        // Fallback to empty array to show the validate button
                        setTriggerConfigs(prev => ({ ...prev, [event]: [] }));
                    }
                }
            }


            updateStep(stepId, { isCreating: false });
        } catch (error) {
            console.error("Failed to handle event selection:", error);
            updateStep(stepId, { isCreating: false, createError: "Failed to load configuration" });
        }
    };


    const handleValidateTrigger = async (stepId: string) => {
        const step = steps.find(s => s.id === stepId);
        if (!step || !currentAreaId) {
            console.error("Cannot validate trigger: missing step or area ID", { step, currentAreaId });
            return;
        }

        updateStep(stepId, { isValidating: true, createError: undefined });

        try {
            const payload = {
                external_service: step.app,
                type: step.event,
                event_type: step.event,
                config: step.config,
                area: currentAreaId,
                is_active: true
            };

            console.log("Validating trigger with payload:", payload);

            let result;
            if (step.createdId) {
                // Update existing trigger
                console.log("Updating existing trigger:", step.createdId);
                result = await patchAreaTrigger(step.createdId, payload);
            } else {
                // Create new trigger
                console.log("Creating new trigger");
                result = await createAreaTrigger(payload);
            }

            // 2. Authorize Trigger
            const authResult = await authorizeAreaTrigger(result.id, payload);
            console.log("Trigger authorization result:", authResult);

            if (authResult.authorized) {
                updateStep(stepId, {
                    isValidated: true,
                    isValidating: false,
                    createdId: result.id
                });
                showAlert("Trigger validated and authorized successfully!");
            } else if (authResult.authorization_url) {
                updateStep(stepId, {
                    isValidated: true,
                    isValidating: false,
                    createdId: result.id
                });
                window.open(authResult.authorization_url, '_blank');
                showAlert("Please complete the authorization in the new tab.");
            } else {
                throw new Error("Authorization failed: No URL provided");
            }
        } catch (error: any) {
            console.error("Failed to validate trigger:", error);
            const is500 = error.response?.status === 500;
            const message = is500
                ? "En cas de code d'erreur 500, veuillez vous rendre dans services, déconnecter votre service GitLab et revenir créer votre AREA."
                : (error.response?.data?.message || error.message || "Failed to validate trigger");

            updateStep(stepId, {
                isValidating: false,
                createError: message
            });

            if (is500) {
                showAlert(message, true);
            }
        }
    };

    const handleValidateAction = async (stepId: string) => {
        const step = steps.find(s => s.id === stepId);
        if (!step || !currentAreaId) return;

        updateStep(stepId, { isValidating: true, createError: undefined });

        try {
            const payload = {
                external_service: step.app,
                action_type: step.event,
                config: step.config,
                area: currentAreaId,
                name: getEventName(step.app, step.event, step.type),
                is_active: true
            };

            console.log("Validating action with payload:", payload);

            let result;
            if (step.createdId) {
                // Update existing action
                console.log("Updating existing action:", step.createdId);
                result = await patchAreaAction(step.createdId, payload);
            } else {
                // Create new action
                console.log("Creating new action");
                result = await createAreaAction(payload);
            }

            // 2. Authorize Action
            const authResult = await authorizeAreaAction(result.id, payload);
            console.log("Action authorization result:", authResult);

            if (authResult.authorized) {
                updateStep(stepId, {
                    isValidated: true,
                    isValidating: false,
                    createdId: result.id
                });
                showAlert("Action validated and authorized successfully!");
            } else if (authResult.authorization_url) {
                updateStep(stepId, {
                    isValidated: true,
                    isValidating: false,
                    createdId: result.id
                });
                window.open(authResult.authorization_url, '_blank');
                showAlert("Please complete the authorization in the new tab.");
            } else {
                throw new Error("Authorization failed: No URL provided");
            }
        } catch (error: any) {
            console.error("Failed to validate action:", error);
            const is500 = error.response?.status === 500;
            const message = is500
                ? "En cas de code d'erreur 500, veuillez vous rendre dans services, déconnecter votre service GitLab et revenir créer votre AREA."
                : (error.response?.data?.message || error.message || "Failed to validate action");

            updateStep(stepId, {
                isValidating: false,
                createError: message
            });

            if (is500) {
                showAlert(message, true);
            }
        }
    };

    const toggleExpanded = (stepId: string) => {
        setSteps(steps.map((step) => step.id === stepId ? { ...step, isExpanded: !step.isExpanded } : step));
    };

    const handleSave = async () => {
        if (!currentAreaId) {
            // If no area exists yet, create it
            return handleAreaNameSubmit();
        }

        try {
            await patchArea(currentAreaId, { description: zapDescription });
            showAlert("Area details saved!");
        } catch (error) {
            console.error("Failed to save area:", error);
            showAlert("Failed to save draft.");
        }
    };

    const handleValidateArea = async () => {
        if (!currentAreaId) {
            showAlert("Please create an area first by entering a name.");
            return;
        }

        const allValidated = steps.every(s => s.isValidated);
        if (!allValidated) {
            showAlert("Please validate all steps before activating the AREA.");
            return;
        }

        const isAnyValidating = steps.some(s => s.isValidating || s.isCreating || s.isCheckingAuth);
        if (isAnyValidating) {
            showAlert("Please wait for all steps to finish their current operations.");
            return;
        }

        const hasTrigger = steps.some(s => s.type === "trigger" && s.isValidated);
        const hasAction = steps.some(s => s.type === "reaction" && s.isValidated);

        if (!hasTrigger || !hasAction) {
            showAlert("An AREA must have at least one validated trigger and one validated action.");
            return;
        }

        try {
            console.log("--- Starting AREA Validation ---");
            console.log("Current Area ID:", currentAreaId);
            console.log("Frontend Steps State:", steps);

            // Fetch latest area state from backend to compare
            const latestArea = await getArea(currentAreaId);
            console.log("Backend Area State:", latestArea);

            if (latestArea.triggers.length === 0) {
                console.error("Validation Error: Backend reports 0 triggers.");
            }
            if (latestArea.actions.length === 0) {
                console.error("Validation Error: Backend reports 0 actions.");
            }

            if (latestArea.status === AreaStatus.ACTIVE) {
                console.log("Area is already active, skipping validation.");
                showAlert("AREA activated successfully!");
                router.push("/area-manager");
                return;
            }

            const result = await validateArea(currentAreaId);
            console.log("Validation Result:", result);
            showAlert("AREA activated successfully!");
            router.push("/area-manager");
        } catch (error: any) {
            console.error("Failed to activate area:", error);
            if (error.response) {
                console.error("Error Response Data:", error.response.data);
                console.error("Error Status:", error.response.status);

                // Handle specific case where backend returns 500 for already active area
                if (error.response.status === 500 &&
                    (typeof error.response.data === 'string' && error.response.data.includes("AREA is already active"))) {
                    showAlert("AREA activated successfully!");
                    router.push("/area-manager");
                    return;
                }

                if (error.response.status === 500) {
                    showAlert("En cas de code d'erreur 500, veuillez vous rendre dans services, déconnecter votre service GitLab et revenir créer votre AREA.", true);
                    return;
                }
            }
            showAlert("Failed to activate AREA.", true);
        }
    };

    const getStepNumber = (index: number) => {
        return index === 0 ? "Trigger" : `Action ${index}`;
    };

    const getAppInfo = (appSlug: string) => services.find(a => a.slug === appSlug);

    const getEventName = (appSlug: string, eventSlug: string, type: "trigger" | "reaction") => {
        const serviceDef = serviceDefinitions[appSlug];
        if (!serviceDef) return eventSlug;
        const list = type === "trigger" ? serviceDef.triggers : serviceDef.actions;
        const item = list.find(i => i.slug === eventSlug);
        return item?.description || item?.name || eventSlug;
    };

    const mapKeyToField = (step: Step, key: string, required: boolean): FieldDefinition => {
        const serviceDef = serviceDefinitions[step.app];
        const definition = step.type === "trigger"
            ? serviceDef?.triggers.find((t: any) => t.slug === step.event)
            : serviceDef?.actions.find((a: any) => a.slug === step.event);

        const existingField = definition?.inputFields?.find((f: FieldDefinition) => f.key === key);
        if (existingField) return { ...existingField, required };

        return {
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
            type: 'string',
            required,
        };
    };

    const renderField = (step: Step, field: FieldDefinition) => {
        const choices = field.choices;

        const configMapField: ConfigMap = {
            step: step.type === "reaction" ? "action" : step.type,
            service: step.app,
            field: field.key,
            label: field.label,
            type: field.type,
            required: field.required || false,
        };

        const standardInput = (
            <>
                {field.type === 'text' ? (
                    <textarea
                        value={step.config[field.key] || ""}
                        onChange={(e) => updateStep(step.id, { config: { ...step.config, [field.key]: e.target.value }, isValidated: false })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-100 transition-all min-h-[100px]"
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                ) : field.type === 'boolean' ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!step.config[field.key]}
                            onChange={(e) => updateStep(step.id, { config: { ...step.config, [field.key]: e.target.checked }, isValidated: false })}
                            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-600">{field.description || field.label}</span>
                    </div>
                ) : (field.type === 'dropdown' || choices) ? (
                    <select
                        value={Array.isArray(step.config[field.key]) ? step.config[field.key][0] : (step.config[field.key] || "")}
                        onChange={(e) => {
                            const val = e.target.value;
                            const finalVal = field.key === 'events' ? [val] : val;
                            updateStep(step.id, { config: { ...step.config, [field.key]: finalVal }, isValidated: false });
                        }}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                        required={field.required}
                    >
                        <option value="">Select...</option>
                        {choices?.map((choice: FieldChoice) => (
                            <option key={choice.value} value={choice.value}>
                                {choice.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={Array.isArray(step.config[field.key]) ? step.config[field.key][0] : (step.config[field.key] || "")}
                        onChange={(e) => {
                            const val = e.target.value;
                            const finalVal = field.key === 'events' ? [val] : val;
                            updateStep(step.id, { config: { ...step.config, [field.key]: finalVal }, isValidated: false });
                        }}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                )}
            </>
        );

        return (
            <div key={field.key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <ConfigField
                    field={configMapField}
                    value={Array.isArray(step.config[field.key]) ? step.config[field.key][0] : (step.config[field.key] || "")}
                    onChange={(val) => {
                        const finalVal = field.key === 'events' ? [val] : val;
                        updateStep(step.id, { config: { ...step.config, [field.key]: finalVal }, isValidated: false });
                    }}
                    fallback={standardInput}
                    allValues={step.config}
                />
                {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
            </div>
        );
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20 font-sans">
            <div className="max-w-4xl mx-auto pb-20">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#116B98] transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Area Manager
                    </button>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            {isEditingName ? (
                                <form onSubmit={handleAreaNameSubmit} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={zapName}
                                        onChange={(e) => setZapName(e.target.value)}
                                        className="text-4xl font-bold border-b-2 rounded-2xl p-4 border-purple-300 focus:border-purple-500 outline-none bg-gray-950 bg-clip-text text-transparent flex-1"
                                        autoFocus
                                        placeholder="Enter area name..."
                                    />
                                    {!currentAreaId && (
                                        <button
                                            type="submit"
                                            disabled={isCreatingArea || !zapName.trim()}
                                            className="px-4 py-2 bg-[#f66d32] cursor-pointer text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isCreatingArea ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                            Save
                                        </button>
                                    )}
                                </form>
                            ) : (
                                <h1
                                    onClick={() => setIsEditingName(true)}
                                    className="text-4xl text-[#f66d32] font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    {zapName}
                                </h1>
                            )}
                            <p className="text-gray-600 text-sm mt-2">
                                {currentAreaId ? (
                                    <>Area ID: {currentAreaId.substring(0, 8)}... • Draft</>
                                ) : (
                                    <>Click the title to {isEditingName ? 'create your area' : 'get started'}</>
                                )}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Description Box */}
                <div className="flex items-center gap-3 mt-4 mb-8 p-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border-2 transition-all duration-300 border-gray-300 hover:border-gray-400">
                    <textarea
                        value={zapDescription}
                        onChange={(e) => setZapDescription(e.target.value)}
                        placeholder="Enter your AREA's description"
                        className="w-full border-none outline-none bg-transparent text-gray-700 font-medium placeholder:text-gray-400 focus:ring-0 rounded-xl h-20 p-2 resize-none"
                    />
                </div>
                <div className="flex items-center gap-3 self-end justify-end mt-4 mb-8 ">
                    <button
                        onClick={handleSave}
                        className="flex cursor-pointer hover:bg-green-50 items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                    >
                        <Save className="w-4 h-4" />
                        Save Draft
                    </button>
                    <button
                        onClick={handleValidateArea}
                        disabled={!steps.every(s => s.isValidated) || steps.some(s => s.isValidating || s.isCreating || s.isCheckingAuth)}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#07BB9C] to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <Rocket className="w-4 h-4" />
                        Validate AREA
                    </button>
                </div>

                {/* Workflow Builder */}
                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="relative">
                            {index > 0 && (
                                <div className="absolute left-1/2 -top-4 w-0.5 h-4 bg-gradient-to-b from-purple-300 to-pink-300 transform -translate-x-1/2" />
                            )}

                            <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border-2 transition-all duration-300 ${step.type === "trigger" ? "border-purple-300" : "border-blue-300"}`}>
                                <div
                                    className={`p-6 cursor-pointer ${step.type === "trigger" ? "bg-gradient-to-r from-purple-50 to-pink-50" : "bg-gradient-to-r from-blue-50 to-cyan-50"} rounded-t-2xl`}
                                    onClick={() => toggleExpanded(step.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${step.type === "trigger" ? "bg-gray-200" : "bg-gradient-to-br from-blue-500 to-cyan-500"} text-white shadow-md`}>
                                                {step.app ? (
                                                    <img src={getAppInfo(step.app)?.logo_url || `/${getAppInfo(step.app)?.slug}.svg`} alt="" className="w-8 h-8 object-contain" />
                                                ) : step.type === "trigger" ? <Zap className="w-6 h-6 text-purple-500" /> : <Settings className="w-6 h-6 text-blue-500" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${step.type === "trigger" ? "bg-[#ECECEC] text-[#E151AF]" : "bg-blue-200 text-blue-700"}`}>
                                                        {getStepNumber(index)}
                                                    </span>
                                                    {step.app && step.event && <CheckCircle className="w-4 h-4 text-[#07BB9C]" />}
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                    {step.app && step.event ? `${getAppInfo(step.app)?.name}: ${getEventName(step.app, step.event, step.type)}` : `Choose a ${step.type === "trigger" ? "Trigger" : "Action"}`}
                                                    {step.isValidated && <Check className="w-5 h-5 text-green-500" />}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const isLastTrigger = step.type === "trigger" && steps.filter(s => s.type === "trigger").length <= 1;
                                                return (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!isLastTrigger) {
                                                                removeStep(step.id);
                                                            }
                                                        }}
                                                        disabled={isLastTrigger}
                                                        title={isLastTrigger ? "Cannot delete the last trigger" : "Delete step"}
                                                        className={`p-2 rounded-lg transition-colors ${isLastTrigger
                                                                ? 'text-gray-300 cursor-not-allowed'
                                                                : 'text-red-600 hover:bg-red-100 cursor-pointer'
                                                            }`}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                );
                                            })()}
                                            {step.isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                        </div>
                                    </div>
                                </div>

                                {step.isExpanded && (
                                    <div className="p-6 space-y-4 animate-in fade-in duration-300">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Service</label>
                                            <AppSelect
                                                value={step.app}
                                                onChange={(val) => handleAppChange(step.id, val)}
                                                options={services}
                                                isLoading={isLoadingServices}
                                            />
                                            {step.consentMessage && (
                                                <p className="text-sm text-orange-600 mt-2 font-medium animate-in fade-in slide-in-from-top-1">
                                                    {step.consentMessage}
                                                </p>
                                            )}
                                        </div>

                                        {step.app && step.isConnected && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Event</label>
                                                <select
                                                    value={step.event}
                                                    onChange={(e) => handleEventSelect(step.id, e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-100 transition-all bg-white text-gray-900"
                                                    style={{ color: '#111827' }} // Force dark text
                                                >
                                                    <option value="" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                                                        Select an event...
                                                    </option>
                                                    {step.app && serviceDefinitions[step.app] && (
                                                        step.type === "trigger"
                                                            ? serviceDefinitions[step.app].triggers.map((t: TriggerDefinition) => (
                                                                <option
                                                                    key={t.slug}
                                                                    value={t.slug}
                                                                    style={{ color: '#111827', backgroundColor: '#ffffff' }}
                                                                >
                                                                    {t.description || t.name || t.slug}
                                                                </option>
                                                            ))
                                                            : serviceDefinitions[step.app].actions.map((a: ActionDefinition) => (
                                                                <option
                                                                    key={a.slug}
                                                                    value={a.slug}
                                                                    style={{ color: '#111827', backgroundColor: '#ffffff' }}
                                                                >
                                                                    {a.description || a.name || a.slug}
                                                                </option>
                                                            ))
                                                    )}
                                                </select>
                                                {step.isCreating && (
                                                    <div className="mt-2 flex items-center gap-2 text-purple-600 text-sm">
                                                        <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                                                    </div>
                                                )}
                                                {step.createError && (
                                                    <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                                        <AlertCircle className="w-4 h-4" /> {step.createError}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {step.app && step.event && triggerConfigs[step.event] && (
                                            <div className="space-y-4 animate-in fade-in duration-300">
                                                <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Configuration</h4>
                                                {(() => {
                                                    const config = triggerConfigs[step.event];
                                                    const hasFields = Array.isArray(config)
                                                        ? config.length > 0
                                                        : (config?.required_fields?.length > 0 || config?.optional_fields?.length > 0);

                                                    return (
                                                        <div className="space-y-6">
                                                            {hasFields ? (
                                                                Array.isArray(config) ? (
                                                                    config.map(field => renderField(step, field))
                                                                ) : (
                                                                    <>
                                                                        {config.required_fields?.length > 0 && (
                                                                            <div className="space-y-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="h-px flex-1 bg-red-100"></div>
                                                                                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Mandatory Fields</span>
                                                                                    <div className="h-px flex-1 bg-red-100"></div>
                                                                                </div>
                                                                                {config.required_fields.map((key: string) => renderField(step, mapKeyToField(step, key, true)))}
                                                                            </div>
                                                                        )}
                                                                        {config.optional_fields?.length > 0 && (
                                                                            <div className="space-y-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="h-px flex-1 bg-gray-100"></div>
                                                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Optional Fields</span>
                                                                                    <div className="h-px flex-1 bg-gray-100"></div>
                                                                                </div>
                                                                                {config.optional_fields.map((key: string) => renderField(step, mapKeyToField(step, key, false)))}
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )
                                                            ) : (
                                                                <div className="text-sm text-gray-500 italic">
                                                                    No configuration fields required for this event.
                                                                </div>
                                                            )}

                                                            <button
                                                                onClick={() => step.type === "trigger" ? handleValidateTrigger(step.id) : handleValidateAction(step.id)}
                                                                disabled={step.isValidating || step.isCreating || step.isCheckingAuth}
                                                                className="w-full mt-4 px-6 py-3 bg-[#07BB9C] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                            >
                                                                {step.isValidating ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                                                {step.isValidated ? "Re-validate" : "Validate"} {step.type === "trigger" ? "Trigger" : "Action"}
                                                            </button>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => addStep("reaction")}
                        disabled={!steps[steps.length - 1].isValidated || steps.some(s => s.isValidating || s.isCreating || s.isCheckingAuth) || !steps[steps.length - 1].app || !steps[steps.length - 1].event}
                        className="w-fit mx-auto px-10 py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-all flex items-center justify-center gap-2 bg-white/50 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Add Action Step
                    </button>
                </div>
            </div>

            <AlertPop
                message={alertConfig.message}
                isVisible={alertConfig.isVisible}
                isError={alertConfig.isError}
                onClose={() => setAlertConfig({ ...alertConfig, isVisible: false })}
            />

            {/* Consent Modal */}
            {consentModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Connect to Service</h3>
                        <p className="text-gray-600 mb-6">
                            Do you want to connect your account to <strong>{services.find(s => s.slug === consentModal.serviceSlug)?.name || consentModal.serviceSlug}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConsentModal({ isOpen: false, serviceSlug: "", stepId: "" })}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConsentConfirm}
                                className="px-4 py-2 bg-[#f66d32] hover:bg-[#f66d32]/60 text-white rounded-xl transition-colors font-medium shadow-lg shadow-purple-600/20"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading editor...</p>
            </div>
        </div>
    );
}

// Export principal avec Suspense
export default function ZapsEditorPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ZapsEditorContent />
        </Suspense>
    );
}