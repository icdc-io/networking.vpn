export const vpnGatewaysPath = () => "gateways";
export const vpnGatewayPath = (id = ":id") => `${id}`;
export const vpnClientConnectionDevicesPath = (
	connectionId = ":connectionId",
) => `connections/${connectionId}/devices`;
