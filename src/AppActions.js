import {
	createData,
	deleteData,
	fetchData,
	showErrorNotification,
	showSuccessNotification,
	updateData,
} from "container/Api";
import * as ActionTypes from "./AppConstants";

// const errorNotification = (error) => {
// 	showErrorNotification(error);
// };

export const getFullPath = (url) => `/api/wireguard/v1${url}`;

export const fetchVpnGateways = () => ({
	type: ActionTypes.VPN_GATEWAYS_FETCH,
	payload: fetchData(getFullPath(ActionTypes.VPN_GATEWAYS_URL)).then(
		(response) => response,
	),
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

export const fetchVpnGateway = (gatewayId) => ({
	type: ActionTypes.VPN_GATEWAY_FETCH,
	payload: fetchData(getFullPath(ActionTypes.vpnGatewayUrl(gatewayId))).then(
		(response) => response,
	),
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
	payload: updateData(
		getFullPath(ActionTypes.vpnGatewayUrl(gatewayId)),
		payload,
	),
});

const handleError = (e) => {
	showErrorNotification(e);
	throw new Error(e);
};

export const editVpnGatewayAndFetch = (gatewayId, payload) => {
	return (dispatch) => {
		const response = dispatch(editVpnGateway(gatewayId, payload));

		return response.then(() => {
			dispatch(fetchVpnGateway(gatewayId));
			dispatch(fetchVpnGateways(gatewayId));
			showSuccessNotification("");
		}, handleError);
	};
};

export const fetchVpnClientConnections = (gatewayId) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTIONS_FETCH,
	payload: fetchData(
		getFullPath(ActionTypes.vpnGatewayUrl(gatewayId, "connections")),
	).then((response) => response),
});

export const fetchVpnClientConnection = (clientConnectionId) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_FETCH,
	payload: fetchData(
		getFullPath(ActionTypes.vpnClientConnectionsUrl(clientConnectionId)),
	).then((response) => response),
});

const createVpnClientConnection = (gatewayId, payload) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_CREATE,
	payload: createData(
		getFullPath(ActionTypes.vpnGatewayUrl(gatewayId, "connections")),
		payload,
	).then((response) => response),
});

export const createVpnClientConnectionAndFetch = (gatewayId, payload) => {
	return (dispatch) => {
		const response = dispatch(createVpnClientConnection(gatewayId, payload));

		return response.then(() => {
			dispatch(fetchVpnClientConnections(gatewayId));
			showSuccessNotification("");
		}, handleError);
	};
};

const updateVpnClientConnection = (clientConnectionId, payload) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_UPDATE,
	payload: updateData(
		getFullPath(ActionTypes.vpnClientConnectionsUrl(clientConnectionId)),
		payload,
	).then((response) => response),
});

export const updateVpnClientConnectionAndFetch = (
	gatewayId,
	clientConnectionId,
	payload,
) => {
	return (dispatch) => {
		const response = dispatch(
			updateVpnClientConnection(clientConnectionId, payload),
		);

		return response.then(() => {
			dispatch(fetchVpnClientConnections(gatewayId));
			showSuccessNotification("");
		}, handleError);
	};
};

const deleteVpnClientConnection = (clientConnectionId) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_DELETE,
	payload: deleteData(
		getFullPath(ActionTypes.vpnClientConnectionsUrl(clientConnectionId)),
	),
});

export const deleteVpnClientConnectionAndFetch = (
	clientConnectionId,
	gatewayId,
) => {
	return (dispatch) => {
		const response = dispatch(deleteVpnClientConnection(clientConnectionId));

		return response.then(() => {
			dispatch(fetchVpnClientConnections(gatewayId));
			showSuccessNotification("");
		}, handleError);
	};
};

export const fetchVpnClientConnectionsNextIp = (id) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_NEXT_IP_FETCH,
	payload: fetchData(getFullPath(ActionTypes.vpnConnectionsNextIpUrl(id))).then(
		(response) => response,
	),
});

export const fetchVpnClientConnectionDevices = (clientConnectionId) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICES_FETCH,
	payload: fetchData(
		getFullPath(
			ActionTypes.vpnClientConnectionsUrl(clientConnectionId, "devices"),
		),
	).then((response) => response),
});

export const cleanVpnClientConnectionDeviceStatus = () => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICES_STATUS_CLEAN,
});

const createVpnClientConnectionDevice = (clientConnectionId, payload) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_CREATE,
	payload: createData(
		getFullPath(
			ActionTypes.vpnClientConnectionsUrl(clientConnectionId, "devices"),
		),
		payload,
	).then((response) => response),
});

export const createVpnClientConnectionDeviceAndFetch = (
	clientConnectionId,
	payload,
) => {
	return (dispatch) => {
		const response = dispatch(
			createVpnClientConnectionDevice(clientConnectionId, payload),
		);

		return response.then(() => {
			dispatch(fetchVpnClientConnectionDevices(clientConnectionId));
			dispatch(fetchVpnClientConnectionsNextIp(clientConnectionId));
			showSuccessNotification("");
		}, handleError);
	};
};

const createQRcode = (deviceId, payload) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_QR_CODE_URL,
	payload: createData(
		getFullPath(ActionTypes.vpnClientConnectionDevicesUrl(deviceId, "qr")),
		payload,
	).then((res) => res.text()),
});

const createConfiguration = (deviceId, payload) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_CONFIGURATION,
	payload: createData(
		getFullPath(ActionTypes.vpnClientConnectionDevicesUrl(deviceId, "config")),
		payload,
	).then((res) => res.text()),
});

export const createQRcodeAndFetch = (deviceId, payload) => {
	return (dispatch) => {
		const responseQR = dispatch(createQRcode(deviceId, payload));
		const responseConfig = dispatch(createConfiguration(deviceId, payload));
		return Promise.all([responseQR, responseConfig]).then(
			() => showSuccessNotification(""),
			handleError,
		);
	};
};

const updateVpnClientConnectionDevice = (deviceId, payload) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_UPDATE,
	payload: updateData(
		getFullPath(ActionTypes.vpnClientConnectionDevicesUrl(deviceId)),
		payload,
	).then((response) => response),
});

export const updateVpnClientConnectionDeviceAndFetch = (
	deviceId,
	clientConnectionId,
	payload,
) => {
	return (dispatch) => {
		const response = dispatch(
			updateVpnClientConnectionDevice(deviceId, payload),
		);

		return response.then(() => {
			dispatch(fetchVpnClientConnectionDevices(clientConnectionId));
			dispatch(fetchVpnClientConnectionsNextIp(clientConnectionId));
			showSuccessNotification("");
		}, handleError);
	};
};

const deleteVpnClientConnectionDevice = (deviceId) => ({
	type: ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_DELETE,
	payload: deleteData(
		getFullPath(ActionTypes.vpnClientConnectionDevicesUrl(deviceId)),
	),
});

export const deleteVpnClientConnectionDeviceAndFetch = (
	deviceId,
	clientConnectionId,
) => {
	return (dispatch) => {
		const response = dispatch(deleteVpnClientConnectionDevice(deviceId));

		return response.then(() => {
			dispatch(fetchVpnClientConnectionDevices(clientConnectionId));
			dispatch(fetchVpnClientConnectionsNextIp(clientConnectionId));
			showSuccessNotification("");
		}, handleError);
	};
};

export const fetchVpnPeerGateways = (gatewayId) => ({
	type: ActionTypes.VPN_PEER_GATEWAYS_FETCH,
	payload: fetchData(
		getFullPath(ActionTypes.vpnGatewayUrl(gatewayId, "remote_gateways")),
	).then((response) => response),
});

const createVpnPeerGateway = (gatewayId, payload) => ({
	type: ActionTypes.VPN_PEER_GATEWAY_CREATE,
	payload: createData(
		getFullPath(ActionTypes.vpnGatewayUrl(gatewayId, "remote_gateways")),
		payload,
	).then((response) => response),
});

export const createVpnPeerGatewayAndFetch = (gatewayId, payload) => {
	return (dispatch) => {
		const response = dispatch(createVpnPeerGateway(gatewayId, payload));

		return response.then(() => {
			dispatch(fetchVpnPeerGateways(gatewayId));
			showSuccessNotification("");
		}, handleError);
	};
};

const updateVpnPeerGateway = (peerGatewayId, payload) => ({
	type: ActionTypes.VPN_PEER_GATEWAY_UPDATE,
	payload: updateData(
		getFullPath(ActionTypes.vpnPeerGatewaysUrl(peerGatewayId)),
		payload,
	).then((response) => response),
});

export const updateVpnPeerGatewayAndFetch = (
	gatewayId,
	peerGatewayId,
	payload,
) => {
	return (dispatch) => {
		const response = dispatch(updateVpnPeerGateway(peerGatewayId, payload));

		return response.then(() => {
			dispatch(fetchVpnPeerGateways(gatewayId));
			showSuccessNotification("");
		}, handleError);
	};
};

const deleteVpnPeerGateway = (peerGatewayId) => ({
	type: ActionTypes.VPN_PEER_GATEWAY_DELETE,
	payload: deleteData(
		getFullPath(ActionTypes.vpnPeerGatewaysUrl(peerGatewayId)),
	),
});

export const deleteVpnPeerGatewayAndFetch = (peerGatewayId, gatewayId) => {
	return (dispatch) => {
		const response = dispatch(deleteVpnPeerGateway(peerGatewayId));

		return response.then(() => {
			dispatch(fetchVpnPeerGateways(gatewayId));
			showSuccessNotification("");
		}, handleError);
	};
};

export const fetchVpnNatMapping = (gatewayId) => ({
	type: ActionTypes.VPN_NAT_MAPPING_FETCH,
	payload: fetchData(
		getFullPath(ActionTypes.vpnGatewayUrl(gatewayId, "nat_maps ")),
	).then((response) => response),
});

const createVpnNatMapping = (gatewayId, payload) => ({
	type: ActionTypes.VPN_NAT_MAPPING_CREATE,
	payload: createData(
		getFullPath(ActionTypes.vpnGatewayUrl(gatewayId, "nat_maps")),
		payload,
	).then((response) => response),
});

export const createVpnNatMappingAndFetch = (gatewayId, payload) => {
	return (dispatch) => {
		const response = dispatch(createVpnNatMapping(gatewayId, payload));

		return response.then(() => {
			dispatch(fetchVpnNatMapping(gatewayId));
			showSuccessNotification("");
		}, handleError);
	};
};

const updateVpnNatMapping = (natMappingId, payload) => ({
	type: ActionTypes.VPN_NAT_MAPPING_UPDATE,
	payload: updateData(
		getFullPath(ActionTypes.vpnNatMappingUrl(natMappingId)),
		payload,
	).then((response) => response),
});

export const updateVpnNatMappingAndFetch = (
	gatewayId,
	natMappingId,
	payload,
) => {
	return (dispatch) => {
		const response = dispatch(updateVpnNatMapping(natMappingId, payload));

		return response.then(() => {
			dispatch(fetchVpnNatMapping(gatewayId));
			showSuccessNotification("");
		}, handleError);
	};
};

const deleteVpnNatMapping = (natMappingId) => ({
	type: ActionTypes.VPN_NAT_MAPPING_DELETE,
	payload: deleteData(getFullPath(ActionTypes.vpnNatMappingUrl(natMappingId))),
});

export const deleteVpnNatMappingAndFetch = (natMappingId, gatewayId) => {
	return (dispatch) => {
		const response = dispatch(deleteVpnNatMapping(natMappingId));

		return response.then(() => {
			dispatch(fetchVpnNatMapping(gatewayId));
			showSuccessNotification("");
		}, handleError);
	};
};
