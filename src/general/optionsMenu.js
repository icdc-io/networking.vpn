import PropTypes from "prop-types";
/* eslint-disable react/display-name */
import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "semantic-ui-react";
import VpnModal from "../components/vpnModal";
import DeleteModal from "./deleteModal";

const OptionsMenu = ({ type, instance, options, onClickAction }) => {
  const { t } = useTranslation();
  const actions = {
    vpnClientConnections: {
      edit: (clientConnection, key) => (
        <VpnModal
          edit
          key={key}
          data={clientConnection}
          formFields={["name", "deviceSubnet", "gateway_ip", "port", "mtu"]}
          editContentMessage={"editClientConnection"}
          managementName="clientConnections"
        />
      ),
      delete: (clientConnection, key) => (
        <DeleteModal key={key} type={type} instance={clientConnection} />
      ),
    },
    vpnPeerGateways: {
      edit: (peerGateway, key) => (
        <VpnModal
          edit
          key={key}
          data={peerGateway}
          formFields={[
            "name",
            "deviceSubnet",
            "gateway_ip",
            "peerEndpoint",
            "publicKey",
            "routeSubnets",
          ]}
          editContentMessage={"editPeerGateway"}
          managementName="peerGateways"
        />
      ),
      delete: (peerGateway, key) => (
        <DeleteModal key={key} type={type} instance={peerGateway} />
      ),
    },
    vpnNatMapping: {
      edit: (natResource, key) => (
        <VpnModal
          edit
          key={key}
          data={natResource}
          formFields={["vpn_ip", "localIp", "hostname"]}
          editContentMessage={"editNatMapping"}
          managementName="natMapping"
        />
      ),
      delete: (natResource, key) => (
        <DeleteModal key={key} type={type} instance={natResource} />
      ),
    },
    gateways: {
      edit: (vpn, key) => (
        <VpnModal
          key={key}
          edit
          data={vpn}
          formFields={["name", "natSubnet"]}
          editContentMessage={"editGateway"}
          managementName="gateway"
        />
      ),
    },
    vpnDevices: {
      edit: (device, key) => (
        <VpnModal
          edit
          key={key}
          data={device}
          formFields={["name", "ip", "publicKey", "routeSubnets"]}
          editContentMessage={"editDevice"}
          managementName="vpnDevices"
        />
      ),
      delete: (device, key) => (
        <DeleteModal key={key} type={type} instance={device} />
      ),
      enable: (key) => (
        <Dropdown.Item
          key={key}
          text={t(instance.status ? "disable" : "enable")}
          onClick={onClickAction}
        />
      ),
      configs: (device, key) => (
        <VpnModal
          privateKey
          key={key}
          data={device}
          formFields={["privateKey"]}
          editContentMessage={"enterPrivatekey"}
          managementName="privateKey"
        />
      ),
    },
  };

  return (
    <Dropdown
      direction="left"
      icon="ellipsis vertical"
      className="users-list__actions_dot"
    >
      <Dropdown.Menu>
        {options.map((option, key) => actions[type][option](instance, key))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

OptionsMenu.propTypes = {
  instance: PropTypes.object,
  type: PropTypes.string,
  options: PropTypes.array,
  onClickAction: PropTypes.func,
};

export default OptionsMenu;
