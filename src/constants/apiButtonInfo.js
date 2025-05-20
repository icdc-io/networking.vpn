import { getFullPath } from "../AppActions";
import {
	VPN_GATEWAYS_URL,
	vpnClientConnectionDevicesUrl,
	vpnClientConnectionsUrl,
	vpnGatewayUrl,
} from "../AppConstants";

export const apiButtonInfo = {
	clientConnections: (id) => ({
		createInfo: {
			name: "test connection",
			ip: "10.207.0.1/24",
			port: "2200",
			mtu: "1420",
		},
		url: getFullPath(vpnGatewayUrl(id, "connections")),
		deleteUrl: getFullPath("/connections/:id"),
	}),
	peerGateways: (id) => ({
		createInfo: {
			name: "zby",
			endpoint: "sys.vpn.zby.icdc.io",
			ip: "10.253.25.1/24",
			public_key: "string",
			subnets: "10.254.64.0/24,10.254.0.0/19",
		},
		url: getFullPath(vpnGatewayUrl(id, "remote_gateways")),
		deleteUrl: getFullPath("/remote_gateways/:id"),
	}),
	natMapping: (id) => ({
		createInfo: {
			vpn_ip: "10.253.25.131",
			local_ip: "198.18.0.5",
			host: "engine-ovirt",
		},
		url: getFullPath(vpnGatewayUrl(id, "nat_maps")),
		deleteUrl: getFullPath("/nat_maps/:id"),
	}),
	vpnGateway: {
		createInfo: {
			name: "cloudgw-a843bf2a",
			public_key: "string",
			private_key: "string",
			hostname: "acc.vpn.loc.icdc.io",
			nat_subnet: "10.253.25.128/25",
		},
		url: getFullPath(VPN_GATEWAYS_URL),
		deleteUrl: getFullPath(`${VPN_GATEWAYS_URL}/:id`),
	},
	vpnDevices: (id) => ({
		createInfo: {
			name: "John Doe Notebook",
			ip: "10.207.0.6",
			public_key: "string",
			keepalived: "25",
			enabled: true,
			subnets: "10.10.10.0/24,10.10.20.0/24",
			owner: "johnDoe@ibagroup.eu",
		},
		url: getFullPath(vpnClientConnectionsUrl(id, "devices")),
		deleteUrl: getFullPath(vpnClientConnectionDevicesUrl(":id")),
	}),
};
