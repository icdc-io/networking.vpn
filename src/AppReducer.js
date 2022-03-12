/* eslint camelcase: 0 */
import * as ActionTypes from './AppConstants';
import Immutable from 'seamless-immutable';

// eslint-disable-next-line new-cap
const initialState = Immutable({
    gateways: [],
    gatewaysFetchStatus: '',
    gateway: {},
    gatewayFetchStatus: '',
    vpnClientConnections: [],
    vpnClientConnectionsFetchStatus: '',
    vpnClientConnection: {},
    vpnClientConnectionFetchStatus: '',
    vpnClientConnectionDevices: [],
    vpnClientConnectionDevicesFetchStatus: '',
    vpnPeerGateways: [],
    vpnPeerGatewaysFetchStatus: '',
    vpnNatMapping: [],
    vpnNatMappingFetchSatus: ''
});

export const VpnStore = (state = initialState, action) => {
    switch (action.type) {

    case `${ActionTypes.VPN_GATEWAYS_FETCH}_PENDING`:
        return state.set('gatewaysFetchStatus', 'pending');
    case `${ActionTypes.VPN_GATEWAYS_FETCH}_REJECTED`:
        return state.set('gatewaysFetchStatus', 'rejected');
    case `${ActionTypes.VPN_GATEWAYS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            gateways: action.payload,
            gatewaysFetchStatus: 'fulfilled'
        });

        // case `${ActionTypes.VPN_GATEWAY_CREATE}_PENDING`:
        //     return state.set('gatewaysFetchStatus', 'pending');
        // case `${ActionTypes.VPN_GATEWAY_CREATE}_REJECTED`:
        //     return state.set('gatewaysFetchStatus', 'rejected');
        // case `${ActionTypes.VPN_GATEWAY_CREATE}_FULFILLED`:
        //     return Immutable.merge(state, {
        //         gateways: [...state.gateways, action.payload],
        //         gatewaysFetchStatus: 'fulfilled'
        //     });

    case `${ActionTypes.VPN_GATEWAY_UPDATE}_PENDING`:
        return state.set('gatewaysFetchStatus', 'pending');
    case `${ActionTypes.VPN_GATEWAY_UPDATE}_REJECTED`:
        return state.set('gatewaysFetchStatus', 'rejected');
    case `${ActionTypes.VPN_GATEWAY_UPDATE}_FULFILLED`:
        return Immutable.merge(state, {
            gateways: [...state.gateways, action.payload],
            gatewaysFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_GATEWAY_FETCH}_PENDING`:
        return state.set('gatewayFetchStatus', 'pending');
    case `${ActionTypes.VPN_GATEWAY_FETCH}_REJECTED`:
        return state.set('gatewayFetchStatus', 'rejected');
    case `${ActionTypes.VPN_GATEWAY_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            gateway: action.payload,
            gatewayFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_CLIENT_CONNECTIONS_FETCH}_PENDING`:
        return state.set('vpnClientConnectionsFetchStatus', 'pending');
    case `${ActionTypes.VPN_CLIENT_CONNECTIONS_FETCH}_REJECTED`:
        return state.set('vpnClientConnectionsFetchStatus', 'rejected');
    case `${ActionTypes.VPN_CLIENT_CONNECTIONS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            vpnClientConnections: action.payload,
            vpnClientConnectionsFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_CLIENT_CONNECTION_FETCH}_PENDING`:
        return state.set('vpnClientConnectionFetchStatus', 'pending');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_FETCH}_REJECTED`:
        return state.set('vpnClientConnectionFetchStatus', 'rejected');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            vpnClientConnection: action.payload,
            vpnClientConnectionFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_CLIENT_CONNECTION_CREATE}_PENDING`:
        return state.set('vpnClientConnectionsFetchStatus', 'pending');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_CREATE}_REJECTED`:
        return state.set('vpnClientConnectionsFetchStatus', 'rejected');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_CREATE}_FULFILLED`:
        return Immutable.merge(state, {
            vpnClientConnections: [action.payload, ...state.vpnClientConnections],
            vpnClientConnectionsFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_CLIENT_CONNECTION_UPDATE}_PENDING`:
        return state.set('vpnClientConnectionsFetchStatus', 'pending');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_UPDATE}_REJECTED`:
        return state.set('vpnClientConnectionsFetchStatus', 'rejected');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_UPDATE}_FULFILLED`:
        return Immutable.merge(state, {
            vpnClientConnections: [...state.vpnClientConnections, action.payload],
            vpnClientConnectionsFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_CLIENT_CONNECTION_DEVICES_FETCH}_PENDING`:
        return state.set('vpnClientConnectionDevicesFetchStatus', 'pending');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_DEVICES_FETCH}_REJECTED`:
        return state.set('vpnClientConnectionDevicesFetchStatus', 'rejected');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_DEVICES_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            vpnClientConnectionDevices: action.payload,
            vpnClientConnectionDevicesFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_CREATE}_PENDING`:
        return state.set('vpnClientConnectionDevicesFetchStatus', 'pending');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_CREATE}_REJECTED`:
        return state.set('vpnClientConnectionDevicesFetchStatus', 'rejected');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_CREATE}_FULFILLED`:
        return Immutable.merge(state, {
            vpnClientConnectionDevices: [action.payload, ...state.vpnClientConnectionDevices],
            vpnClientConnectionDevicesFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_UPDATE}_PENDING`:
        return state.set('vpnClientConnectionDevicesFetchStatus', 'pending');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_UPDATE}_REJECTED`:
        return state.set('vpnClientConnectionDevicesFetchStatus', 'rejected');
    case `${ActionTypes.VPN_CLIENT_CONNECTION_DEVICE_UPDATE}_FULFILLED`:
        return Immutable.merge(state, {
            // vpnClientConnectionDevices: [action.payload, ...state.vpnClientConnectionDevices],
            vpnClientConnectionDevicesFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_PEER_GATEWAYS_FETCH}_PENDING`:
        return state.set('vpnPeerGatewaysFetchStatus', 'pending');
    case `${ActionTypes.VPN_PEER_GATEWAYS_FETCH}_REJECTED`:
        return state.set('vpnPeerGatewaysFetchStatus', 'rejected');
    case `${ActionTypes.VPN_PEER_GATEWAYS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            vpnPeerGateways: action.payload,
            vpnPeerGatewaysFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_PEER_GATEWAY_CREATE}_PENDING`:
        return state.set('vpnPeerGatewaysFetchStatus', 'pending');
    case `${ActionTypes.VPN_PEER_GATEWAY_CREATE}_REJECTED`:
        return state.set('vpnPeerGatewaysFetchStatus', 'rejected');
    case `${ActionTypes.VPN_PEER_GATEWAY_CREATE}_FULFILLED`:
        return Immutable.merge(state, {
            vpnPeerGateways: [action.payload, ...state.vpnPeerGateways],
            vpnPeerGatewaysFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_PEER_GATEWAY_UPDATE}_PENDING`:
        return state.set('vpnPeerGatewaysFetchStatus', 'pending');
    case `${ActionTypes.VPN_PEER_GATEWAY_UPDATE}_REJECTED`:
        return state.set('vpnPeerGatewaysFetchStatus', 'rejected');
    case `${ActionTypes.VPN_PEER_GATEWAY_UPDATE}_FULFILLED`:
        return Immutable.merge(state, {
            vpnPeerGateways: [...state.vpnPeerGateways, action.payload],
            vpnPeerGatewaysFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_NAT_MAPPING_FETCH}_PENDING`:
        return state.set('vpnNatMappingFetchSatus', 'pending');
    case `${ActionTypes.VPN_NAT_MAPPING_FETCH}_REJECTED`:
        return state.set('vpnNatMappingFetchSatus', 'rejected');
    case `${ActionTypes.VPN_NAT_MAPPING_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            vpnNatMapping: action.payload,
            vpnNatMappingFetchSatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_NAT_MAPPING_CREATE}_PENDING`:
        return state.set('vpnNatMappingFetchSatus', 'pending');
    case `${ActionTypes.VPN_NAT_MAPPING_CREATE}_REJECTED`:
        return state.set('vpnNatMappingFetchSatus', 'rejected');
    case `${ActionTypes.VPN_NAT_MAPPING_CREATE}_FULFILLED`:
        return Immutable.merge(state, {
            vpnNatMapping: [...state.vpnNatMapping, action.payload],
            vpnNatMappingFetchSatus: 'fulfilled'
        });

    case `${ActionTypes.VPN_NAT_MAPPING_UPDATE}_PENDING`:
        return state.set('vpnNatMappingFetchSatus', 'pending');
    case `${ActionTypes.VPN_NAT_MAPPING_UPDATE}_REJECTED`:
        return state.set('vpnNatMappingFetchSatus', 'rejected');
    case `${ActionTypes.VPN_NAT_MAPPING_UPDATE}_FULFILLED`:
        return Immutable.merge(state, {
            vpnNatMapping: [...state.vpnNatMapping, action.payload],
            vpnNatMappingFetchSatus: 'fulfilled'
        });

    default:
        return state;
    }

};
