import { Tabs, TabsContent, TabsList, TabsTrigger } from "container/Tabs";
import { isAdminRights } from "container/roleUtils";
import { Pen } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
	fetchVpnClientConnections,
	fetchVpnGateway,
	fetchVpnNatMapping,
	fetchVpnPeerGateways,
} from "../AppActions";
import { apiButtonInfo } from "../constants/apiButtonInfo";
import GeneralModal from "../general/GeneralModal";
import ButtonBack from "../general/buttonBack";
import svgVpn from "../static/svgVpn.svg";
import GatewayForm from "./GatewayForm";
import VpnApiButton from "./VpnApiButton";
import { dataStatusCheck, formatVpnGatewaysData } from "./tools";
import { capitalizeFirstLetter, longDash } from "./tools";
import VpnDetailsTable from "./vpnDetailsTable";

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
		fetchStatus: "vpnClientConnectionsFetchStatus",
	});
	const natModalRef = useRef();

	useEffect(() => {
		user.location && dispatch(fetchVpnGateway(id));
	}, [dispatch, id, user]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

	const onEditNat = (natData) => (_e) => {
		if (natModalRef.current) {
			natModalRef.current.handleClick(natData);
		}
	};

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
							<h3 className="title" color="blue">
								{capitalizeFirstLetter(gateway.name || "")}
							</h3>
						</div>
						<div>
							<React.Suspense fallback={null}>
								<VpnApiButton info={apiButtonInfo.vpnGateway} />
							</React.Suspense>
						</div>
					</div>
					<br />
					<h4>{t("vpnDetails")}</h4>
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
								{isAdminRights(user.role) && (
									<button onClick={onEditNat(gateway)} type="button">
										<Pen size={16} />
									</button>
								)}
								{/* <VpnModal
									button
									pencil
									edit
									data={gateway}
									formFields={["natSubnet"]}
									editContentMessage={"editNatSubnet"}
									managementName="gateway"
								/> */}
							</div>
						</div>
					</div>

					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="vpn-tabs h-full"
					>
						<TabsList>
							{tabs.map((item) => (
								<TabsTrigger key={item} value={item} className="tab-trigger">
									{t(item)}
								</TabsTrigger>
							))}
						</TabsList>
						<hr className="" />
						{tabs
							.filter((tab) => tab === activeTab)
							.map((item) => (
								<TabsContent
									key={item}
									value={item}
									className="h-full flex flex-col gap-4"
								>
									<VpnDetailsTable
										tableName={activeTab}
										headers={
											menuItems.filter((item) => item.name === activeTab)[0]
												.headers
										}
										reduxStateName={tableData.reduxStateName || []}
										reduxFetchStatus={tableData.fetchStatus}
										gatewayPublicHostname={gatewayPublicHostname}
									/>
								</TabsContent>
							))}
					</Tabs>
					<span />
				</>,
			)}
			<GeneralModal ref={natModalRef} title="editGateway">
				{(initialState, onCancel) => (
					<GatewayForm initialValues={initialState} onCancel={onCancel} edit />
				)}
			</GeneralModal>
		</div>
	);
};

export default VpnDetails;
