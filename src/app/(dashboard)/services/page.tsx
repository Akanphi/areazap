"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getServiceAccounts, deleteServiceAccount, ServiceAccount, getConnectedServices, ExternalService } from "@/api/serviceAccounts";
import { CheckCircle, XCircle, ExternalLink, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { API_URL } from "@/api/api";
import AlertPop from "@/components/ui/AlertPop";
import ActionModal from "@/components/ui/ActionModal";

// Available services configuration
const AVAILABLE_SERVICES = [
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
    // {
    //     provider: "discord",
    //     name: "Discord",
    //     description: "Send messages and manage servers",
    //     icon: "/discord.svg",
    //     color: "from-indigo-500 to-blue-500",
    // },
    // {
    //     provider: "telegram",
    //     name: "Telegram",
    //     description: "Send messages and manage chats",
    //     icon: "/telegram.svg",
    //     color: "from-blue-400 to-cyan-500",
    // },
    {
        provider: "gitlab",
        name: "GitLab",
        description: "Manage repositories, issues, and pull requests",
        icon: "/gitlab.svg",
        color: "from-gray-700 to-gray-900",
    }
];

export default function ServicesPage() {
    console.log("UI: ServicesPage component function called");
    const [serviceAccounts, setServiceAccounts] = useState<ServiceAccount[]>([]);
    const [connectedServices, setConnectedServices] = useState<ExternalService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [alertConfig, setAlertConfig] = useState<{ isVisible: boolean; message: string }>({
        isVisible: false,
        message: "",
    });
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        serviceId: string | null;
    }>({
        isOpen: false,
        serviceId: null,
    });

    const showAlert = (message: string) => {
        setAlertConfig({ isVisible: true, message });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, isVisible: false }));
    };

    const fetchData = async () => {
        console.log("UI: fetchData() called");
        try {
            console.log("UI: Fetching accounts...");
            const accounts = await getServiceAccounts();
            console.log("UI: Accounts received:", accounts);

            console.log("UI: Fetching connectedServices...");
            const connected = await getConnectedServices();
            console.log("UI: connectedServices received:", connected);

            setServiceAccounts(accounts);
            setConnectedServices(connected);
            console.log("UI: State updated successfully");
        } catch (error) {
            console.error("UI: fetchData() FAILED", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("UI: ServicesPage useEffect triggered");
        fetchData();

        const handleFocus = () => {
            fetchData();
        };

        window.addEventListener("focus", handleFocus);

        // Listen for messages from the OAuth popup
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.data.type === "oauth_success") {
                fetchData();
                showAlert("Service connected successfully!");
            }
        };

        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    const handleConnect = (provider: string) => {
        // Redirect to backend OAuth endpoint
        const authUrl = `/auth/initiate?provider=${provider}`;

        // Open in a popup for a better experience
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        window.open(
            authUrl,
            `Connect ${provider}`,
            `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
        );
    };

    const handleDisconnect = (serviceId: string) => {
        setModalConfig({
            isOpen: true,
            serviceId: serviceId,
        });
    };

    const confirmDisconnect = async () => {
        if (!modalConfig.serviceId) return;

        const serviceId = modalConfig.serviceId;
        setModalConfig(prev => ({ ...prev, isOpen: false }));

        try {
            await deleteServiceAccount(serviceId);
            fetchData();
            showAlert("Service disconnected successfully.");
        } catch (error) {
            console.error("Failed to disconnect service:", error);
            showAlert("Failed to disconnect service.");
        }
    };
    console.log("UI: Rendering ServicesPage, connectedServices:", connectedServices);
    if (connectedServices.length > 0) {
        console.log("UI: Found connected services!", connectedServices);
    } else {
        console.log("UI: No connected services found in state.");
    }
    const isServiceConnected = (provider: string) => {
        const connected = connectedServices.some(service =>
            service.slug.toLowerCase() === provider.toLowerCase()
        );
        if (connected) console.log(`UI: Service ${provider} is CONNECTED (found in connectedServices)`);
        return connected;
    };

    const getConnectedAccount = (provider: string) => {
        const externalService = connectedServices.find(s => s.slug.toLowerCase() === provider.toLowerCase());

        const account = serviceAccounts.find(account =>
            account.external_service.toLowerCase() === provider.toLowerCase() ||
            (externalService && account.external_service === externalService.id)
        );

        if (!account && isServiceConnected(provider)) {
            console.warn(`UI: MISMATCH! Service ${provider} is connected but NO ACCOUNT found in serviceAccounts.`);
            console.log("UI: Current serviceAccounts external_service values:", serviceAccounts.map(a => a.external_service));
            console.log("UI: Target provider:", provider);
            if (externalService) console.log("UI: Target service ID:", externalService.id);
        }
        return account;
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Connected Services
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Connect external services to automate your workflows
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AVAILABLE_SERVICES.map((service) => {
                        const isConnected = isServiceConnected(service.provider);
                        const connectedAccount = getConnectedAccount(service.provider);

                        return (
                            <div
                                key={service.provider}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                            >
                                {/* Service Header */}
                                <div
                                    className={`h-32 bg-linear-to-br ${service.color} flex items-center justify-center relative`}
                                >
                                    <div className="absolute top-4 right-4">
                                        {isConnected ? (
                                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Connected
                                            </div>
                                        ) : (
                                            <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                <XCircle className="w-3 h-3" />
                                                Not Connected
                                            </div>
                                        )}
                                    </div>
                                    <Image
                                        src={service.icon}
                                        alt={service.name}
                                        width={64}
                                        height={64}
                                        className="drop-shadow-lg"
                                    />
                                </div>

                                {/* Service Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {service.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {service.description}
                                    </p>

                                    {isConnected ? (
                                        <div className="space-y-3">
                                            {connectedAccount ? (
                                                <>
                                                    <div className="text-xs text-gray-500">
                                                        <p>
                                                            <span className="font-medium">Account:</span>{" "}
                                                            {connectedAccount.display_name || "Linked Account"}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDisconnect(connectedAccount.id)}
                                                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Disconnect
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-center py-4">
                                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            className="w-full bg-gray-950 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Connect {service.name}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        🔐 Secure OAuth Connection
                    </h3>
                    <p className="text-blue-800 text-sm">
                        When you click "Connect", you'll be redirected to the service's
                        official login page. We never see your password - the service
                        provides us with a secure token to perform actions on your behalf.
                    </p>
                </div>
            </div>
            <AlertPop
                isVisible={alertConfig.isVisible}
                message={alertConfig.message}
                onClose={hideAlert}
            />
            <ActionModal
                isOpen={modalConfig.isOpen}
                title="Confirm Disconnection"
                message="Are you sure you want to disconnect this service? You will need to reconnect it to use it in your Areas."
                type="warning"
                onConfirm={confirmDisconnect}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                confirmText="Disconnect"
            />
        </div>
    );
}
