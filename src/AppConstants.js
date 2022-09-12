export const VPN_GATEWAYS_URL = '/gateways';
export const VPN_GATEWAYS_FETCH = 'VPN_GATEWAYS_FETCH';
export const VPN_GATEWAY_UPDATE = 'VPN_GATEWAY_UPDATE';
// export const VPN_GATEWAY_CREATE = 'VPN_GATEWAY_CREATE';
// export const VPN_GATEWAY_DELETE = 'VPN_GATEWAY_DELETE';
export const VPN_GATEWAY_FETCH = 'VPN_GATEWAY_FETCH';
export const VPN_CLIENT_CONNECTIONS_FETCH = 'VPN_CLIENT_CONNECTIONS_FETCH';
export const VPN_CLIENT_CONNECTION_FETCH = 'VPN_CLIENT_CONNECTION_FETCH';
export const VPN_CLIENT_CONNECTION_CREATE = 'VPN_CLIENT_CONNECTION_CREATE';
export const VPN_CLIENT_CONNECTION_UPDATE = 'VPN_CLIENT_CONNECTION_UPDATE';
export const VPN_CLIENT_CONNECTION_DELETE = 'VPN_CLIENT_CONNECTION_DELETE';
export const VPN_CLIENT_CONNECTION_DEVICE_STATS_FETCH = 'VPN_CLIENT_CONNECTION_DEVICE_STATS_FETCH';
export const VPN_CLIENT_CONNECTION_DEVICES_STATUS_CLEAN = 'VPN_CLIENT_CONNECTION_DEVICES_STATUS_CLEAN';
export const VPN_CLIENT_CONNECTION_DEVICES_FETCH = 'VPN_CLIENT_CONNECTION_DEVICES_FETCH';
export const VPN_CLIENT_CONNECTION_DEVICE_CREATE = 'VPN_CLIENT_CONNECTION_DEVICE_CREATE';
export const VPN_CLIENT_CONNECTION_DEVICE_UPDATE = 'VPN_CLIENT_CONNECTION_DEVICE_UPDATE';
export const VPN_CLIENT_CONNECTION_DEVICE_DELETE = 'VPN_CLIENT_CONNECTION_DEVICE_DELETE';
export const VPN_CLIENT_CONNECTION_DEVICE_QR_CODE_URL = 'VPN_CLIENT_CONNECTION_DEVICE_QR_CODE_URL'
export const VPN_CLIENT_CONNECTION_DEVICE_CONFIGURATION = 'VPN_CLIENT_CONNECTION_DEVICE_CONFIGURATION'
export const VPN_PEER_GATEWAYS_FETCH = 'VPN_PEER_GATEWAYS_FETCH';
export const VPN_PEER_GATEWAY_CREATE = 'VPN_PEER_GATEWAY_CREATE';
export const VPN_PEER_GATEWAY_UPDATE = 'VPN_PEER_GATEWAY_UPDATE';
export const VPN_PEER_GATEWAY_DELETE = 'VPN_PEER_GATEWAY_DELETE';
export const VPN_NAT_MAPPING_FETCH = 'VPN_NAT_MAPPING_FETCH';
export const VPN_NAT_MAPPING_CREATE = 'VPN_NAT_MAPPING_CREATE';
export const VPN_NAT_MAPPING_UPDATE = 'VPN_NAT_MAPPING_UPDATE';
export const VPN_NAT_MAPPING_DELETE = 'VPN_NAT_MAPPING_DELETE';

export const vpnGatewayUrl = (id, management = '') => management ? `/gateways/${id}/${management}` : `/gateways/${id}`;
export const vpnClientConnectionsUrl = (id, clientConnectionDetails) => `/connections/${id}${clientConnectionDetails ? '/' + clientConnectionDetails : ''}`;
export const vpnClientConnectionDevicesUrl = (id, stats) => `/devices/${id}${stats ? '/' + stats : ''}`;
export const vpnPeerGatewaysUrl = id => `/remote_gateways/${id}`;
export const vpnNatMappingUrl = id => `/nat_maps/${id}`;

export const notificationMessages = {
    ru: {
        error: 'Ошибка! ',
        success: 'Успешно! ',
        sgNotExist: 'Группы безопасности с таким ID не существует',
        ruleEditError: 'Ошибка при редактировании правила',
        routerNotExist: 'Сетевого маршрутизатора с таким ID не существует',
        unauthorized: 'Пользователь не авторизирован',
        // removalProcessStarted: 'Процесс удаления запущен',
        cannotDeleteGroupWithAssignedVmsNics: `Невозможно удалить группу безопасности с назначенными NICs`,
        ruleAlreadyExists: 'Правило уже существует'
    },
    en: {
        error: 'Error! ',
        success: 'Success! ',
        sgNotExist: 'Could not find Security group with such ID',
        ruleEditError: 'Firewall rule edit error',
        routerNotExist: 'Could not find Network router with such ID',
        unauthorized: 'Unauthorized',
        cannotDeleteGroupWithAssignedVmsNics: `Can't delete security group with assigned NICs`,
        // removalProcessStarted: 'The deletion process has started',
        ruleAlreadyExists: 'Rule already exists'
    }
};
