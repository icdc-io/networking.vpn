import { returnBaseUrl } from "container/ReturnBaseUrl";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Modal } from "semantic-ui-react";
import { CustomAccordion } from "../general/customAccordion";
import CustomChipInput from "../general/customChipInput";
import CustomDropdown from "../general/customDropdown";
import {
  hostname,
  ip,
  ipWithSubnetPrefix,
  isPrivateKey,
  maxLength4,
  maxLength10,
  maxLength30,
  maxLength63,
  mtu,
  name,
  nameWithSpace,
  number,
  peerEndpoint,
  port,
  publicKey,
  required,
} from "../utilities/Validations";
import { composeValidators } from "../utilities/composeValidators";

const GeneralInput = React.lazy(
  () => import("container/networking/GeneralInput"),
);

const VpnForm = ({
  handleClose,
  onSubmit,
  edit,
  pencil,
  privateKey,
  configs,
  fieldNames,
  managementName,
  initialValues,
}) => {
  const { t } = useTranslation();
  const urlQR = useSelector(
    (state) => state.VpnStore.vpnClientConnectionDevicesQRcode,
  );
  const user = useSelector((state) => state.host.user);
  const configStatus = useSelector(
    (state) => state.VpnStore.vpnClientConnectionDevicesConfigStatus,
  );
  const configuration = useSelector(
    (state) => state.VpnStore.vpnClientConnectionDevicesConfig,
  );
  const [selectedConfig, setSelectedConfig] = useState(0);
  const baseUrls = useSelector((state) => state.host.baseUrls);

  const buttonContent = edit ? t("save") : privateKey ? t("proceed") : t("add");

  const placeholderMessages = {
    clientConnections: {
      name: "enterName",
      deviceSubnet: "enterIpWithPrefix",
      gateway_ip: "enterIp",
      port: "enterPort",
      mtu: "enterMtu",
    },
    peerGateways: {
      name: "enterName",
      peerEndpoint: "enterPeerEndpoint",
      deviceSubnet: "enterIpWithPrefix",
      gateway_ip: "enterIp",
      publicKey: "enterPublicKey",
      routeSubnets: "enterRouteSubnets",
    },
    gateway: {
      name: "enterName",
      natSubnet: "enterNat",
    },
    vpnDevices: {
      name: "enterName",
      ip: "enterIp",
      publicKey: "enterPublicKey",
      routeSubnets: "enterRouteSubnets",
      keepAlive: "enterKeepAlive",
    },
    privateKey: {
      privateKey: "enterPrivateKey",
    },
    natMapping: {
      vpn_ip: "enterVpnIp",
      localIp: "enterLocalIp",
      hostname: "enterHostname",
    },
  };

  const validations = {
    clientConnections: {
      name: [name, maxLength10],
      deviceSubnet: [ipWithSubnetPrefix],
      gateway_ip: [ip],
      port: [port],
      mtu: [mtu, maxLength4],
    },
    peerGateways: {
      name: [name, maxLength30],
      deviceSubnet: [ipWithSubnetPrefix],
      gateway_ip: [ip],
      peerEndpoint: [peerEndpoint],
      publicKey: [publicKey],
      routeSubnets: [],
    },
    natMapping: {
      hostname: [hostname, maxLength63],
      vpn_ip: [ip],
      localIp: [ip],
    },
    gateway: {
      name: [name, maxLength30],
      natSubnet: [ipWithSubnetPrefix],
    },
    vpnDevices: {
      name: [nameWithSpace, required],
      ip: [ip, required],
      publicKey: [publicKey, required],
      routeSubnets: [],
      keepAlive: [number],
    },
    privateKey: {
      privateKey: [isPrivateKey],
    },
  };

  const baseHostname = returnBaseUrl(baseUrls, user.location);

  const displayFields = fieldNames.map((item, key) => {
    const initial = initialValues && edit ? initialValues[item] : undefined;
    return (
      <div className={item === "hostname" ? "hostname-field" : ""} key={key}>
        <Field
          // type={item === "routeSubnets" && "select-multiple"}
          key={key}
          name={item}
          label={
            item === "ip" && managementName !== "vpnDevices"
              ? t("ipWithSubnetPrefix")
              : t([item])
          }
          component={
            item === "routeSubnets"
              ? CustomChipInput
              : item === "peerEndpoint"
                ? CustomDropdown
                : GeneralInput
          }
          initialValue={initial}
          customInitialValue={initial}
          validate={composeValidators(...validations[managementName][item])}
          placeholder={t(placeholderMessages[managementName][item])}
        />
        {item === "hostname" && <p>{`.${user.account}.vpn.${baseHostname}`}</p>}
      </div>
    );
  });

  const deviceConfigsData = [
    {
      title: "qrCodeTitle",
      descriptions: [
        { text: "descriptionQrFirst" },
        { text: "descriptionQrSecond" },
        { text: "descriptionQrThird" },
      ],
      urlQR: urlQR,
    },
    {
      title: "windowsTitle",
      descriptions: [
        { text: "descriptionWinConfigFirst" },
        { text: "descriptionWinConfigSecond" },
        { text: "descriptionWinConfigThird" },
        { text: "descriptionWinConfigFour" },
      ],
      config: configuration,
    },
    {
      title: "linuxTitle",
      descriptions: [
        { text: "descriptionLinuxConfigFirst" },
        { text: "descriptionLinuxConfigSecond" },
        { text: "descriptionLinuxConfigThird" },
      ],
      config: configuration,
    },
  ];
  const deviceConfigs = deviceConfigsData.map((el, index) => (
    <CustomAccordion
      key={index}
      index={index}
      configData={el}
      open={selectedConfig === index}
      handleClick={setSelectedConfig}
    />
  ));

  return (
    <Form onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit, pristine, invalid }) => (
        <form onSubmit={handleSubmit} className="ui form vpn-form">
          {(pencil || privateKey || configs) && (
            <>
              <label htmlFor="">{t("name")}</label>
              <p>{initialValues.name}</p>
            </>
          )}
          {!configs && displayFields}
          {privateKey && (
            <div className="privateKeyInfo">{t("privateKeyInfo")}</div>
          )}
          {configs && configStatus === "fulfilled" && (
            <>
              <label htmlFor="">{t("files")}</label>
              {deviceConfigs}
            </>
          )}
          <Modal.Actions align="right" style={{ marginTop: 20 }}>
            {!privateKey && (
              <Button
                onClick={handleClose}
                content={configs ? t("close") : t("cancel")}
                primary={configs}
              />
            )}
            {!configs && (
              <Button
                primary
                type="submit"
                content={buttonContent}
                disabled={pristine || invalid}
              />
            )}
          </Modal.Actions>
        </form>
      )}
    </Form>
  );
};

VpnForm.propTypes = {
  handleClose: PropTypes.func,
  onSubmit: PropTypes.func,
  edit: PropTypes.any,
  fieldNames: PropTypes.array,
  managementName: PropTypes.string,
  initialValues: PropTypes.object,
  pencil: PropTypes.bool,
  privateKey: PropTypes.bool,
  configs: PropTypes.object,
};

export default VpnForm;
