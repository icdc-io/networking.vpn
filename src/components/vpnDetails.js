/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Header, Menu } from "semantic-ui-react";
import {
  fetchVpnClientConnections,
  fetchVpnGateway,
  fetchVpnNatMapping,
  fetchVpnPeerGateways,
} from "../AppActions";
import ButtonBack from "../general/buttonBack";
import { dataStatusCheck, formatVpnGatewaysData } from "./tools";
import "./vpnDetails.scss";
import { useTranslation } from "react-i18next";
import svgVpn from "../static/svgVpn.svg";
import { capitalizeFirstLetter, longDash } from "./tools";
import VpnDetailsTable from "./vpnDetailsTable";
import VpnModal from "./vpnModal";

const ApiButton = React.lazy(() => import("container/ApiButton"));

const VpnDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const gateway = useSelector((state) =>
    formatVpnGatewaysData(state.VpnStore.gateway),
  );
  const gatewayFetchStatus = useSelector(
    (state) => state.VpnStore.gatewayFetchStatus,
  );
  const user = useSelector((state) => state.host.user);
  const gatewayPublicHostname = gateway.hostname;
  const tabs = ["clientConnections", "peerGateways", "natMapping"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [tableData, setTableData] = useState({
    reduxStateName: "vpnClientConnections",
    fetchStatus: "vpnCLientConnectionsFetchStatus",
  });
  const baseUrls = useSelector((state) => state.host.baseUrls);

  useEffect(() => {
    user.location && dispatch(fetchVpnGateway(id));
  }, [dispatch, id, user]);

  useEffect(() => {
    switch (activeTab) {
      case "clientConnections":
        dispatch(fetchVpnClientConnections(id));
        setTableData({
          ...tableData,
          reduxStateName: "vpnClientConnections",
          fetchStatus: "vpnClientConnectionsFetchStatus",
        });
        return;
      case "peerGateways":
        dispatch(fetchVpnPeerGateways(id));
        setTableData({
          ...tableData,
          reduxStateName: "vpnPeerGateways",
          fetchStatus: "vpnPeerGatewaysFetchStatus",
        });
        return;
      case "natMapping":
        dispatch(fetchVpnNatMapping(id));
        setTableData({
          ...tableData,
          reduxStateName: "vpnNatMapping",
          fetchStatus: "vpnNatMappingFetchSatus",
        });
        return;
    }
  }, [dispatch, activeTab, id, user, user.location, user.role, user.account]);

  const menuItems = [
    {
      name: "clientConnections",
      menuItem: t("clientConnections"),
      headers: ["name", "deviceSubnet", "gateway_ip", "endpoint", ""],
      formFields: ["name", "subnet", "gateway_ip", "port", "mtu"],
      createModalFields: ["name", "deviceSubnet", "gateway_ip", "port", "mtu"],
      addContentMessage: "addClientConnection",
    },
    {
      name: "peerGateways",
      menuItem: t("peerGateways"),
      headers: [
        "name",
        "deviceSubnet",
        "gateway_ip",
        "peerEndpoint",
        "publicKey",
        "routeSubnets",
        "",
      ],
      formFields: [
        "name",
        "subnet",
        "gateway_ip",
        "peerEndpoint",
        "publicKey",
        "routeSubnets",
      ],
      createModalFields: [
        "name",
        "deviceSubnet",
        "gateway_ip",
        "peerEndpoint",
        "publicKey",
        "routeSubnets",
      ],
      addContentMessage: "addPeerGateway",
    },
    {
      name: "natMapping",
      menuItem: t("natMapping"),
      headers: ["hostname", "vpn_ip", "localIp", ""],
      formFields: ["vpn_ip", "localIp", "hostname"],
      createModalFields: ["vpn_ip", "localIp", "hostname"],
      addContentMessage: "addNatMapping",
    },
  ];

  return (
    <div className="vpn-details-wrapper">
      <ButtonBack back={t("back")} path={".."} />

      {dataStatusCheck(
        gatewayFetchStatus,
        t,
        <>
          <div className="gateway-title-wrapper">
            <div className="gateway-title">
              <img src={svgVpn} alt="Vpn" />
              <Header as="h3" className="title" color="blue">
                {capitalizeFirstLetter(gateway.name || "")}
              </Header>
            </div>
            <div>
              <React.Suspense fallback={null}>
                <ApiButton
                  element="vpnGateway"
                  user={user}
                  locationUrl={baseUrls[user.location]}
                />
              </React.Suspense>
            </div>
          </div>
          <Header as="h4" style={{ marginTop: 16 }}>
            {t("vpnDetails")}
          </Header>
          <div className="vpn-details-container">
            <div className="vpn-details">
              <div>{t("cloudGatewayInstance")}</div>
              <div>{t("publicKey")}</div>
              <div>{t("publicHostnameVpn")}</div>
              <div>{t("internalAddress")}</div>
              <div>{t("natSubnet")}</div>
            </div>
            <div className="vpn-details">
              <div>{gateway.cloudGatewayInstance || longDash}</div>
              <div>{gateway.publicKey || longDash}</div>
              <div>{gateway.hostname || longDash}</div>
              <div>{gateway.internalAddress || longDash}</div>
              <div>
                {gateway.natSubnet || longDash}{" "}
                <VpnModal
                  button
                  pencil
                  edit
                  data={gateway}
                  formFields={["natSubnet"]}
                  editContentMessage={"editNatSubnet"}
                  managementName="gateway"
                />
              </div>
            </div>
          </div>
          <div className="menu-container">
            <Menu pointing secondary color="blue" className="submenu" compact>
              {menuItems.map((item, key) => (
                <Menu.Item
                  key={key}
                  name={item.menuItem}
                  active={activeTab === item.name}
                  onClick={() => setActiveTab(item.name)}
                />
              ))}
            </Menu>
            <span />
          </div>
          <div className="sub-menu-container">
            <React.Suspense fallback={null}>
              <ApiButton
                element={
                  activeTab === "clientConnections"
                    ? "vpnConnection"
                    : activeTab === "peerGateways"
                      ? "vpnRemoteGateways"
                      : "vpnNatMapping"
                }
                gatewayId={id}
                user={user}
                locationUrl={baseUrls[user.location]}
              />
            </React.Suspense>
            {menuItems.map(
              (item, key) =>
                activeTab === item.name && (
                  <VpnModal
                    key={key}
                    formFields={item.createModalFields}
                    addContentMessage={item.addContentMessage}
                    managementName={activeTab}
                    natSubnet={gateway.natSubnet}
                  />
                ),
            )}
          </div>
          <VpnDetailsTable
            tableName={activeTab}
            headers={
              menuItems.filter((item) => item.name === activeTab)[0].headers
            }
            reduxStateName={tableData.reduxStateName || []}
            reduxFetchStatus={tableData.fetchStatus}
            gatewayPublicHostname={gatewayPublicHostname}
          />
        </>,
      )}
    </div>
  );
};

export default VpnDetails;
