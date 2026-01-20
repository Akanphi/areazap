import { CheckCircle, XCircle, ExternalLink, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { ServiceConfig } from "@/constants/services";
import { ServiceAccount } from "@/api/serviceAccounts";

interface ServiceCardProps {
    service: ServiceConfig;
    isConnected: boolean;
    connectedAccount?: ServiceAccount;
    onConnect: (provider: string) => void;
    onDisconnect: (serviceId: string) => void;
}

export default function ServiceCard({
    service,
    isConnected,
    connectedAccount,
    onConnect,
    onDisconnect
}: ServiceCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Service Header */}
            <div className={`h-32 bg-linear-to-br ${service.color} flex items-center justify-center relative`}>
                <div className="absolute top-4 right-4">
                    {isConnected ? (
                        <div className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
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
                    style={{ height: 'auto' }}
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
                                    onClick={() => onDisconnect(connectedAccount.id)}
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
                        onClick={() => onConnect(service.provider)}
                        className="w-full bg-gray-950 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Connect {service.name}
                    </button>
                )}
            </div>
        </div>
    );
}
