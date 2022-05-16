export const getConfiguration = (data) => {
return `# File: vpn-${data.vpnConnectName}.conf
[Interface]
PrivateKey = ${data.devicePrivateKey}
Address = ${data.deviceIp}/${data.vpnConnectSubPrefix}
# DNS = \${LOCATION.PUBLIC_DNS}
[Peer]
PublicKey = ${data.locationPublicKey}
AllowedIPs = ${data.vpnConnectSubnet};${data.natMapSubnet};${data.vpcAllSubnets}
Endpoint = ${data.account}.vpn.${data.locationName}.icdc.io:${data.vpnConnectPort}
PersistentKeepalive = ${data.deviceKeepAlive}`
};
