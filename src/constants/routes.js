export const vpnGatewaysPath = () => "gateways";
export const vpnGatewayPath = (id = ":id") => `gateways/${id}`;
export const vpnClientConnectionDevicesPath = (
  connectionId = ":connectionId",
) => `connections/${connectionId}/devices`;
