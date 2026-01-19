import { ServiceAccount, ExternalService } from "@/api/serviceAccounts";

/**
 * Check if a service is connected based on provider slug
 */
export const isServiceConnected = (
    provider: string,
    connectedServices: ExternalService[]
): boolean => {
    return connectedServices.some(service =>
        service.slug.toLowerCase() === provider.toLowerCase()
    );
};

/**
 * Get the connected account for a specific provider
 */
export const getConnectedAccount = (
    provider: string,
    serviceAccounts: ServiceAccount[],
    connectedServices: ExternalService[]
): ServiceAccount | undefined => {
    const externalService = connectedServices.find(
        s => s.slug.toLowerCase() === provider.toLowerCase()
    );

    return serviceAccounts.find(account =>
        account.external_service.toLowerCase() === provider.toLowerCase() ||
        (externalService && account.external_service === externalService.id)
    );
};

/**
 * Open OAuth popup with centered dimensions
 */
export const openOAuthPopup = (provider: string, authUrl: string): void => {
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
