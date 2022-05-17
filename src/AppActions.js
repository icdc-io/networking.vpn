import * as ActionTypes from './AppConstants';
import API from './utilities/Api';
import cogoToast from 'cogo-toast';

const waitingForBaseUrl = async() => {
    const data = await window.insights.getUserInfo();
    const location = window.insights.getLocation();
    return data.external.locations[location];
};

const base = async(url) => await waitingForBaseUrl() + `/api/wireguard/v1` + url;

const notificationOptions = { position: 'top-right', hideAfter: 7 };

const errorHandler = (error) => {
    if (error.includes('Could not find security_group with such id')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].sgNotExist;
    }

    if (error.includes('Firewall rule edit error')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].ruleEditError;
    }

    if (error.includes('Could not find network_router with such id')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].routerNotExist;
    }

    if (error.includes('401')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].unauthorized;
    }

    if (error.includes('Rule already exists')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].ruleAlreadyExists;
    }

    if (error.includes(`Can't delete security group with assigned NICs`)) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].cannotDeleteGroupWithAssignedVmsNics;
    }

    return '';
};

const errorNotification = (error) => {
    const errorTypeCheck = error instanceof Object ? error.message : error;
    cogoToast.error(ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].error +
        errorHandler(errorTypeCheck), notificationOptions);
};

const successNotification = (msg) =>
    cogoToast.success(ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].success + msg, notificationOptions);

export const infoNotification = (msg) =>
    cogoToast.info(msg, notificationOptions);

    const expandHeaders = (headers) => {
        const account = window.insights.getAccount();
        const role = window.insights.getRole();
    
        return {
            ...headers,
            Authorization: `Bearer ${window.insights.getToken()}`,
            X_MIQ_GROUP: `${account.toLowerCase()}.${role.toLowerCase()}`,
            'x-icdc-role': role,
            'x-icdc-account': account
        };
};

const fetchData = async (url, headers) => {
    const response = await API.get(await base(url), expandHeaders(headers));
    return response.data;
};

const createData = async (url, headers, payload) => {
    const response = await API.post(await base(url), expandHeaders(headers), payload);
    return response.data;
};

const updateData = async (url, headers, payload) => {
    const response = await API.put(await base(url), payload, expandHeaders(headers));
    return response.data;
};

const deleteData = async (url, headers) => {
    const response = await API.delete(await base(url), expandHeaders(headers));
    return response;
};

export const fetchVpnGateways = () => ({
    type: ActionTypes.VPN_GATEWAYS_FETCH,
    payload: fetchData(ActionTypes.VPN_GATEWAYS_URL, {}).then(response => response)
});

// ------------- THIS IS PAUSED IN DEVELOPEMENT DO NOT DELETE -------------
// export const createVpnGateway = payload => ({
//     type: ActionTypes.VPN_GATEWAY_CREATE,
//     payload: createData(ActionTypes.VPN_GATEWAYS_URL, {}, payload)
// });

// export const createVpnGatewayAndFetch = payload => {
//     return dispatch => {
//         const response = dispatch(createVpnGateway(payload));

//         response.then(() => {
//             dispatch(fetchVpnGateways());
//             successNotification('');
//         }, error => errorNotification(error));
//     };
// };

export const fetchVpnGateway = gatewayId => ({
    type: ActionTypes.VPN_GATEWAY_FETCH,
    payload: fetchData(ActionTypes.vpnGatewayUrl(gatewayId), {}, {}).then(response => response)
});

// ------------- THIS IS PAUSED IN DEVELOPEMENT DO NOT DELETE -------------
// export const deleteVpnGateway = gatewayId => ({
//     type: ActionTypes.VPN_GATEWAY_DELETE,
//     payload: deleteData(ActionTypes.vpnGatewayUrl(gatewayId), {})
// });

// export const deleteVpnGatewayAndFetch = gatewayId => {
//     return dispatch => {
//         const response = dispatch(deleteVpnGateway(gatewayId));

//         response.then(() => {
//             dispatch(fetchVpnGateways());
//             successNotification('');
//         }, error => errorNotification(error));
//     };
// };

export const editVpnGateway = (gatewayId, payload) => ({
    type: ActionTypes.VPN_GATEWAY_UPDATE,
    payload: updateData(ActionTypes.vpnGatewayUrl(gatewayId), {}, payload)
});

export const editVpnGatewayAndFetch = (gatewayId, payload) => {
    return dispatch => {
        const response = dispatch(editVpnGateway(gatewayId, payload));

        response.then(() => {
            dispatch(fetchVpnGateways(gatewayId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const fetchVpnClientConnections = gatewayId => ({
    type: ActionTypes.VPN_CLIENT_CONNECTIONS_FETCH,
    payload: fetchData(ActionTypes.vpnGatewayUrl(gatewayId, 'connections'), {}).then(response => response)
});

export const fetchVpnClientConnection = clientConnectionId => ({
    type: ActionTypes.VPN_CLIENT_CONNECTION_FETCH,
    payload: fetchData(ActionTypes.vpnClientConnectionsUrl(clientConnectionId), {}).then(response => response)
});

const createVpnClientConnection = (gatewayId, payload) => ({
    type: ActionTypes.VPN_CLIENT_CONNECTION_CREATE,
    payload: createData(ActionTypes.vpnGatewayUrl(gatewayId, 'connections'), {}, payload).then(response => response)
});

export const createVpnClientConnectionAndFetch = (gatewayId, payload) => {
    return (dispatch) => {
        const response = dispatch(createVpnClientConnection(gatewayId, payload));

        response.then(() => {
            dispatch(fetchVpnClientConnections(gatewayId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

const updateVpnClientConnection = (clientConnectionId, payload) => ({
    type: ActionTypes.VPN_CLIENT_CONNECTION_UPDATE,
    payload: updateData(ActionTypes.vpnClientConnectionsUrl(clientConnectionId), {}, payload).then(response => response)
});

export const updateVpnClientConnectionAndFetch = (gatewayId, clientConnectionId, payload) => {
    return (dispatch) => {
        const response = dispatch(updateVpnClientConnection(clientConnectionId, payload));

        response.then(() => {
            dispatch(fetchVpnClientConnections(gatewayId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

const deleteVpnClientConnection = clientConnectionId => ({
    type: ActionTypes.VPN_CLIENT_CONNECTION_DELETE,
    payload: deleteData(ActionTypes.vpnClientConnectionsUrl(clientConnectionId), {})
});

export const deleteVpnClientConnectionAndFetch = (clientConnectionId, gatewayId) => {
    return (dispatch) => {
        const response = dispatch(deleteVpnClientConnection(clientConnectionId));

        response.then(() => {
            dispatch(fetchVpnClientConnections(gatewayId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const fetchVpnClientConnectionDevices = clientConnectionId => ({
    type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICES_FETCH,
    payload: fetchData(ActionTypes.vpnClientConnectionsUrl(clientConnectionId, 'devices'), {}).then(response => response)
});

const createVpnClientConnectionDevice = (clientConnectionId, payload) => ({
    type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_CREATE,
    payload: createData(ActionTypes.vpnClientConnectionsUrl(clientConnectionId, 'devices'), {}, payload).then(response => response)
});

export const createVpnClientConnectionDeviceAndFetch = (clientConnectionId, payload) => {
    return (dispatch) => {
        const response = dispatch(createVpnClientConnectionDevice(clientConnectionId, payload));

        response.then(() => {
            dispatch(fetchVpnClientConnectionDevices(clientConnectionId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

const fetchQR = async (url, headers, payload) => {
    let currentUrl = await base(url) ;
       return  await fetch(currentUrl, {
            method: 'POST',
            headers: expandHeaders(headers),
            body: payload
          }).then(response => response.blob().then(data => URL.createObjectURL(data)))
}

const createQRcode = (deviceId, payload) => ({
    type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_QR_CODE_URL,
    payload: fetchQR(ActionTypes.vpnClientConnectionDevicesUrl(deviceId, 'qr'), { }, payload)
})

const createConfiguration = (deviceId, payload) => ({
    type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_CONFIGURATION,
    payload: createData(ActionTypes.vpnClientConnectionDevicesUrl(deviceId, 'config'), { }, payload)
})


export const createQRcodeAndFetch = (deviceId, payload) => {
    console.log(payload)
    return (dispatch) => {
        const responseQR = dispatch(createQRcode(deviceId, payload));
        const responseConfig = dispatch(createConfiguration(deviceId, payload));
        Promise.all([responseQR, responseConfig]).then(() => successNotification(''), error => errorNotification(error))
    };
};

const updateVpnClientConnectionDevice = (deviceId, payload) => ({
    type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_UPDATE,
    payload: updateData(ActionTypes.vpnClientConnectionDevicesUrl(deviceId), {}, payload).then(response => response)
});

export const updateVpnClientConnectionDeviceAndFetch = (deviceId, clientConnectionId, payload) => {
    return (dispatch) => {
        const response = dispatch(updateVpnClientConnectionDevice(deviceId, payload));

        response.then(() => {
            dispatch(fetchVpnClientConnectionDevices(clientConnectionId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

const deleteVpnClientConnectionDevice = deviceId => ({
    type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_DELETE,
    payload: deleteData(ActionTypes.vpnClientConnectionDevicesUrl(deviceId), {})
});

export const deleteVpnClientConnectionDeviceAndFetch = (deviceId, clientConnectionId) => {
    return (dispatch) => {
        const response = dispatch(deleteVpnClientConnectionDevice(deviceId));

        response.then(() => {
            dispatch(fetchVpnClientConnectionDevices(clientConnectionId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const fetchVpnPeerGateways = gatewayId => ({
    type: ActionTypes.VPN_PEER_GATEWAYS_FETCH,
    payload: fetchData(ActionTypes.vpnGatewayUrl(gatewayId, 'remote_gateways'), {}).then(response => response)
});

const createVpnPeerGateway = (gatewayId, payload) => ({
    type: ActionTypes.VPN_PEER_GATEWAY_CREATE,
    payload: createData(ActionTypes.vpnGatewayUrl(gatewayId, 'remote_gateways'), {}, payload).then(response => response)
});

export const createVpnPeerGatewayAndFetch = (gatewayId, payload) => {
    return (dispatch) => {
        const response = dispatch(createVpnPeerGateway(gatewayId, payload));

        response.then(() => {
            dispatch(fetchVpnPeerGateways(gatewayId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

const updateVpnPeerGateway = (peerGatewayId, payload) => ({
    type: ActionTypes.VPN_PEER_GATEWAY_UPDATE,
    payload: updateData(ActionTypes.vpnPeerGatewaysUrl(peerGatewayId), {}, payload).then(response => response)
});

export const updateVpnPeerGatewayAndFetch = (gatewayId, peerGatewayId, payload) => {
    return (dispatch) => {
        const response = dispatch(updateVpnPeerGateway(peerGatewayId, payload));

        response.then(() => {
            dispatch(fetchVpnPeerGateways(gatewayId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

const deleteVpnPeerGateway = peerGatewayId => ({
    type: ActionTypes.VPN_PEER_GATEWAY_DELETE,
    payload: deleteData(ActionTypes.vpnPeerGatewaysUrl(peerGatewayId), {})
});

export const deleteVpnPeerGatewayAndFetch = (peerGatewayId, gatewayId) => {
    return (dispatch) => {
        const response = dispatch(deleteVpnPeerGateway(peerGatewayId));

        response.then(() => {
            dispatch(fetchVpnPeerGateways(gatewayId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const fetchVpnNatMapping = gatewayId => ({
    type: ActionTypes.VPN_NAT_MAPPING_FETCH,
    payload: fetchData(ActionTypes.vpnGatewayUrl(gatewayId, 'nat_maps '), {}).then(response => response)
});

const createVpnNatMapping = (gatewayId, payload) => ({
    type: ActionTypes.VPN_NAT_MAPPING_CREATE,
    payload: createData(ActionTypes.vpnGatewayUrl(gatewayId, 'nat_maps'), {}, payload).then(response => response)
});

export const createVpnNatMappingAndFetch = (gatewayId, payload) => {
    return (dispatch) => {
        const response = dispatch(createVpnNatMapping(gatewayId, payload));

        response.then(() => {
            dispatch(fetchVpnNatMapping(gatewayId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

const updateVpnNatMapping = (natMappingId, payload) => ({
    type: ActionTypes.VPN_NAT_MAPPING_UPDATE,
    payload: updateData(ActionTypes.vpnNatMappingUrl(natMappingId), {}, payload).then(response => response)
});

export const updateVpnNatMappingAndFetch = (gatewayId, natMappingId, payload) => {
    return (dispatch) => {
        const response = dispatch(updateVpnNatMapping(natMappingId, payload));

        response.then(() => {
            dispatch(fetchVpnNatMapping(gatewayId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

const deleteVpnNatMapping = natMappingId => ({
    type: ActionTypes.VPN_NAT_MAPPING_DELETE,
    payload: deleteData(ActionTypes.vpnNatMappingUrl(natMappingId), {})
});

export const deleteVpnNatMappingAndFetch = (natMappingId, gatewayId) => {
    return (dispatch) => {
        const response = dispatch(deleteVpnNatMapping(natMappingId));

        response.then(() => {
            dispatch(fetchVpnNatMapping(gatewayId));
            successNotification('');
        }, error => errorNotification(error));
    };
};
