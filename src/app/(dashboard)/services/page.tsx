"use client";

import { useState, useEffect } from "react";
import { getServiceAccounts, deleteServiceAccount, ServiceAccount, getConnectedServices, ExternalService } from "@/api/serviceAccounts";
import AlertPop from "@/components/ui/AlertPop";
import ActionModal from "@/components/ui/ActionModal";
import ServiceCard from "@/components/services/ServiceCard";
import ServicesHeader from "@/components/services/ServicesHeader";
import ServicesInfoBox from "@/components/services/ServicesInfoBox";
import { AVAILABLE_SERVICES } from "@/constants/services";
import { isServiceConnected, getConnectedAccount, openOAuthPopup } from "@/utils/services";

export default function ServicesPage() {
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
        try {
            const [accounts, connected] = await Promise.all([
                getServiceAccounts(),
                getConnectedServices()
            ]);

            setServiceAccounts(accounts);
            setConnectedServices(connected);
        } catch (error) {
            console.error("Failed to fetch services data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const handleFocus = () => {
            fetchData();
        };

        // Listen for messages from the OAuth popup
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.data.type === "oauth_success") {
                fetchData();
                showAlert("Service connected successfully!");
            }
        };

        window.addEventListener("focus", handleFocus);
        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    const handleConnect = (provider: string) => {
        const authUrl = `/auth/initiate?provider=${provider}`;
        openOAuthPopup(provider, authUrl);
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

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <ServicesHeader />

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AVAILABLE_SERVICES.map((service) => {
                        const connected = isServiceConnected(service.provider, connectedServices);
                        const account = getConnectedAccount(
                            service.provider,
                            serviceAccounts,
                            connectedServices
                        );

                        return (
                            <ServiceCard
                                key={service.provider}
                                service={service}
                                isConnected={connected}
                                connectedAccount={account}
                                onConnect={handleConnect}
                                onDisconnect={handleDisconnect}
                            />
                        );
                    })}
                </div>

                <ServicesInfoBox />
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
