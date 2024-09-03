import React from "react";
import { Loader } from "semantic-ui-react";

const NoContent = React.lazy(() => import("container/NoContent"));

/**
 * Formats the gateways data so that it doesn't contain "_"
 * @param {*} data
 * @returns
 */
export const formatVpnGatewaysData = (data) => {
  if (Array.isArray(data)) {
    return data.map((gateway) => ({
      id: gateway.id,
      name: gateway.name,
      cloudGatewayId: gateway.cloudgw_id,
      cloudGatewayInstance: gateway.cloudgw_instance,
      account: gateway.account,
      hostname: gateway.hostname,
      publicKey: gateway.public_key,
      privateKey: gateway.private_key,
      natSubnet: gateway.nat_subnet,
      internalAddress: gateway.internal_address,
    }));
  }

  return {
    id: data.id,
    name: data.name,
    cloudGatewayId: data.cloudgw_id,
    cloudGatewayInstance: data.cloudgw_instance,
    account: data.account,
    hostname: data.hostname,
    publicKey: data.public_key,
    privateKey: data.private_key,
    natSubnet: data.nat_subnet,
    internalAddress: data.internal_address,
  };
};

/**
 * Formats the data for the submenu of the Gateway's details page
 * @param {Array} data Redux state data
 * @param {string} tableName The name of the table
 * @returns {Array} Array with the formatted data
 */
export const formatTableData = (data, tableName) => {
  if (data.length === 0) {
    return;
  }

  /* eslint-disable */
  switch (tableName) {
    case "clientConnections":
      return data.map((clientConnection) => ({
        id: clientConnection.id,
        gatewayId: clientConnection.gateway_id,
        name: clientConnection.name,
        deviceSubnet: clientConnection.subnet,
        gateway_ip: clientConnection.gateway_ip,
        port: clientConnection.port,
        mtu: clientConnection.mtu, // Maximum transmission unit
      }));
    case "peerGateways":
      return data.map((peerGateway) => ({
        id: peerGateway.id,
        gatewayId: peerGateway.gateway_id,
        name: peerGateway.name,
        deviceSubnet: peerGateway.subnet,
        gateway_ip: peerGateway.gateway_ip,
        peerEndpoint: peerGateway.endpoint,
        publicKey: peerGateway.public_key,
        routeSubnets: peerGateway.subnets,
      }));
    case "natMapping":
      return data.map((natMapping) => ({
        id: natMapping.id,
        gatewayId: natMapping.gateway_id,
        vpn_ip: natMapping.vpn_ip,
        localIp: natMapping.local_ip,
        hostname: natMapping.host,
      }));
  }
  /* eslint-enable */
};

export const formatClientConnectionData = (data) => ({
  id: data.id,
  gatewayId: data.gateway_id,
  name: data.name,
  subnet: data.subnet,
  gateway_ip: data.gateway_ip,
  port: data.port,
  mtu: data.mtu, // Maximum transmission unit
});

export const formatDevicesData = (devices) =>
  devices.map((device) => ({
    id: device.id,
    connectionId: device.connection_id,
    name: device.name,
    ip: device.ip,
    publicKey: device.public_key,
    status: device.enabled,
    routeSubnets: device.subnets,
    owner: device.owner,
    keepAlive: device.keepAlived,
    statistics: {
      deviceId: device.stat?.device_id,
      createdAt: device.stat?.created_at,
      endpoint: device.stat?.endpoint,
      lastConnection: device.stat?.handshake,
      received: device.stat?.received,
      sent: device.stat?.sent,
    },
  }));

/**
 * Depending on the fetch status a coresponding component will be shown that indicates the fetch state of the data
 * @param {string} fetchStatus
 * @param {*} content
 */
export const dataStatusCheck = (fetchStatus, t, content) => {
  /* eslint-disable */
  switch (fetchStatus) {
    case "pending":
      return <Loader active inline="centered" />;
    case "rejected":
      return <NoContent icon="desktop" textMessage={t("wrong")} />;
    case "fulfilled":
      return content;
  }
  /* eslint-enable */
};

export const truncate = (str, n) => {
  if (n) {
    return str.length > n ? str.substr(0, n - 1) + "..." : false;
  }

  return str.includes(",") ? str.split(",")[0] : false;
};

export const longDash = "—";
export const capitalizeFirstLetter = (text) =>
  text.charAt(0).toUpperCase() + text.slice(1);
