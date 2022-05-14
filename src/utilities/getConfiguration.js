export const defaultConfiguration = `# File: vpn-\${VPN_CONN.NAME}.conf
[Interface]
PrivateKey = \${DEVICE.PRIVATE_KEY}
Address = \${DEVICE.IP}/$\{VPN_CONN.SUBNET_PREFIX}
# DNS = \${LOCATION.PUBLIC_DNS}
[Peer]
PublicKey = \${LOCATION.PUBLIC_KEY}
# PresharedKey = {Pre-shared-key-here} # do not render for now
AllowedIPs = \${VPN_CONN.SUBNET};\${NAT_MAP.SUBNET};\${VPC.ALL_SUBNETS}
Endpoint = \${ACCOUNT}.vpn.\${LOCATION.NAME}.icdc.io:\${VPN_CONN.PORT}
PersistentKeepalive = \${DEVICE.KEEPALIVE}`;

export const getConfiguration = (data) => {
return `# File: vpn-${data.vpnConnectName}.conf
[Interface]
PrivateKey = ${data.devicePrivateKey}
Address = ${data.deviceIp}/${data.vpnConnectSubPrefix}
# DNS = ${data.dns}
[Peer]
PublicKey = ${data.locationPublicKey}
# PresharedKey = {Pre-shared-key-here} # do not render for now
AllowedIPs = ${data.vpnConnectSubnet};${data.natMapSubnet};${data.vpcAllSubnets}
Endpoint = ${data.account}.vpn.${data.locationName}.icdc.io:${data.vpnConnectPort}
PersistentKeepalive = ${data.deviceKeepAlive}`
};
