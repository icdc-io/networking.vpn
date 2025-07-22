import { Button } from "container/Button";
import CopyButton from "container/CopyButton";
import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import OptionsMenu from "container/OptionsMenu";
import Popup from "container/Popup";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "container/Table";
import React, { useEffect, useState, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
	cleanVpnClientConnectionDeviceStatus,
	deleteVpnClientConnectionDeviceAndFetch,
	fetchVpnClientConnection,
	fetchVpnClientConnectionDevices,
	fetchVpnClientConnectionsNextIp,
	fetchVpnGateway,
	updateVpnClientConnectionDeviceAndFetch,
} from "../AppActions";
import { apiButtonInfo } from "../constants/apiButtonInfo";
import GeneralModal from "../general/GeneralModal";
import ButtonBack from "../general/buttonBack";
import CustomPagination from "../general/customPagination";
import PrivateKeyForm from "./PrivateKeyForm";
import VpnApiButton from "./VpnApiButton";
import VpnDeviceForm from "./VpnDeviceForm";
import DeviceStatistics from "./deviceStatistics";
import StatusLabel from "./statusLabel";
import {
	dataStatusCheck,
	formatClientConnectionData,
	formatDevicesData,
	formatVpnGatewaysData,
} from "./tools";
import { capitalizeFirstLetter, longDash, truncate } from "./tools";

function getToken() {
	return new Promise((resolve) => {
		if (!window.parent) {
			console.log("No parent window available");
			resolve("");
		}

		const requestId = Math.random().toString(36).substr(2, 9);

		const messageHandler = (event) => {
			if (event.origin !== window.origin) return;
			if (
				event.data?.requestId === requestId &&
				event.data?.action === "sendToken"
			) {
				window.removeEventListener("message", messageHandler);

				if (event.data?.token) {
					resolve(event.data.token);
				} else {
					console.log("No token received");
					resolve("");
				}
			}
		};

		window.addEventListener("message", messageHandler);

		window.parent.postMessage({ requestId, action: "getToken" }, window.origin);
	});
}
const totalPaginationPages = 10;

const ClientConnectionDevices = () => {
	const { t } = useTranslation();
	const { connectionId } = useParams();
	const dispatch = useDispatch();
	const [activePageNumber, setActivePageNumber] = useState(1);
	const pageViseted = totalPaginationPages * (activePageNumber - 1);
	const vpnClientConnectionDevicesData = useSelector((state) =>
		formatDevicesData(state.VpnStore.vpnClientConnectionDevices),
	);
	const vpnClientConnectionData = useSelector((state) =>
		formatClientConnectionData(state.VpnStore.vpnClientConnection),
	);
	const vpnGatewayData = useSelector((state) =>
		formatVpnGatewaysData(state.VpnStore.gateway),
	);
	const devicesFetchStatus = useSelector(
		(state) => state.VpnStore.vpnClientConnectionDevicesFetchStatus,
	);
	const clientConnectionFetchStatus = useSelector(
		(state) => state.VpnStore.vpnClientConnectionFetchStatus,
	);
	// const gatewayFetchStatus = useSelector(state => state.VpnStore.gatewayFetchStatus);
	const headers = [
		"name",
		"ip",
		"publicKey",
		"status",
		"uploadSpeed",
		"downloadSpeed",
		"lastConnection",
		"",
	];

	const deviceModalRef = useRef();
	const configsModalRef = useRef();

	const user = useSelector((state) => state.host.user);
	const baseUrls = useSelector((state) => state.host.baseUrls);
	const deleteModalRef = useRef();

	const ws = useRef(null);

	const [stats, setStats] = useState([]);

	const devicesIds =
		devicesFetchStatus === "fulfilled" &&
		vpnClientConnectionDevicesData
			.map((el) => `dev_id[]=${el.id}&`)
			.join("")
			.slice(0, -1);

	const [protocol, locationUrl] = baseUrls[user.location]
		.split("http")[1]
		.split("://");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		dispatch(fetchVpnClientConnectionsNextIp(connectionId));
	}, []);

	const wsConnect = async () => {
		if (user.account && devicesIds) {
			const token = await getToken();
			ws.current = new WebSocket(
				`ws${protocol}://${locationUrl}/ws/wireguard_manager/stats?${devicesIds}`,
				["actioncable-v1-json", token, user.account, user.role],
			);
			ws.current.onopen = () => {
				const subscribe_msg = {
					command: "subscribe",
					identifier: JSON.stringify({ channel: "DeviceStatisticChannel" }),
				};
				ws.current.send(JSON.stringify(subscribe_msg));
			};

			ws.current.onmessage = (e) => {
				const message = JSON.parse(e.data);

				if (
					message.type === "ping" ||
					message.type === "confirm_subscription" ||
					message.type === "welcome"
				) {
					return;
				}
				setStats(message.message?.stats || []);
			};
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		wsConnect();
		//ws.current.onclose = () => console.log('Соединение закрыто');
	}, [user.account, devicesIds]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		return function cleanup() {
			ws.current?.close();
			dispatch(cleanVpnClientConnectionDeviceStatus());
		};
	}, []);

	// const vpnClientConnectionDevicesData = formatDevicesData(devices); //Uncomment to test pagintaion

	useEffect(() => {
		if (user.location && connectionId) {
			dispatch(fetchVpnClientConnection(connectionId));
			dispatch(fetchVpnClientConnectionDevices(connectionId));
		}
	}, [dispatch, user, connectionId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		vpnClientConnectionData.gatewayId &&
			dispatch(fetchVpnGateway(vpnClientConnectionData.gatewayId));
	}, [dispatch, user, vpnClientConnectionData.gatewayId]);

	const formatDate = (item) => {
		if (item && new Date(item).getFullYear() !== 1970) {
			const dateOptions = {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			};
			const timeOptions = {
				hour: "2-digit",
				minute: "2-digit",
				hour12: "true",
			};

			const date = new Date(item).toLocaleDateString("en-GB", dateOptions);
			const time = new Date(item).toLocaleTimeString("en-US", timeOptions);
			return `${date}, ${time}`;
		}

		return;
	};

	const displayHeaders = headers.map((header, key) => (
		<TableHead
			key={header}
			style={header === "status" ? { paddingLeft: 40 } : {}}
		>
			{header !== "" ? t([header]) : ""}
		</TableHead>
	));

	const enableOrDisableDevice = (data) => (e) => {
		dispatch(
			updateVpnClientConnectionDeviceAndFetch(data.id, data.connectionId, {
				name: data.name,
				ip: data.ip,
				// eslint-disable-next-line camelcase
				public_key: data.publicKey,
				keepalived: data.keepAlive,
				enabled: !data.status,
				subnets: data.routeSubnets,
				owner: data.owner,
			}),
		);
	};

	const returnPopupContent = {
		publicKey: (content) => ({
			cellContent: truncate(content, 12),
			popupContent: (
				<div className="flex">
					<div>{content}</div>&nbsp;&nbsp;
					<CopyButton content={content} />
				</div>
			),
		}),
	};

	const addPopup = (content, header) => {
		const { cellContent, popupContent } = returnPopupContent[header](content);

		return (
			<div className="flex">
				{cellContent || content}
				&ensp;
				{cellContent && (
					<Popup content={popupContent}>
						<button type="button" className="popup-dots">
							...
						</button>
					</Popup>
				)}
			</div>
		);
	};

	const onOpenConfigs = (deviceData) => (_e) => {
		if (configsModalRef.current) {
			configsModalRef.current.handleClick(deviceData);
		}
	};

	const onAddDevice = (_e) => {
		if (deviceModalRef.current) {
			deviceModalRef.current.handleClick();
		}
	};

	const onEditDevice = (deviceData) => (_e) => {
		if (deviceModalRef.current) {
			deviceModalRef.current.handleClick(deviceData);
		}
	};

	const onDelete = (instanceData) => (_e) => {
		if (deleteModalRef.current) {
			deleteModalRef.current.handleClick(instanceData);
		}
	};

	const options = (data) => {
		return [
			{
				text: "configs",
				action: onOpenConfigs,
			},
			{
				text: data.status ? "disable" : "enable",
				action: enableOrDisableDevice,
			},
			{
				text: "edit",
				action: onEditDevice,
			},
			{
				text: "delete",
				action: onDelete,
				color: "red",
			},
		];
	};

	const tableCells = (data) =>
		headers.map((header, key) => {
			const currentDevice = stats.find((el) => el.device_id === data.id);
			let content = data[header] || longDash;
			const currentHandshake = stats.length > 0 && currentDevice?.handshake;

			if (header === "publicKey") {
				content = data[header] ? addPopup(content, header) : longDash;
			} else if (header === "status") {
				content = <StatusLabel active={data[header]} />;
			} else if (header === "uploadSpeed" || header === "downloadSpeed") {
				content = (
					<DeviceStatistics
						statisticsData={currentDevice}
						field={header === "uploadSpeed" ? "sent" : "received"}
					/>
				);
			} else if (header === "lastConnection") {
				content = formatDate(currentHandshake) || longDash;
			} else if (header === "") {
				content = (
					<OptionsMenu
						// type="vpnDevices"
						instance={data}
						options={options(data)}
						// onClickAction={() => enableOrDisableDevice(data)}
					/>
				);
			}

			return (
				<TableCell key={header} align={header === "" ? "right" : "left"}>
					{content}
				</TableCell>
			);
		});

	const withContent =
		devicesFetchStatus === "fulfilled" &&
		vpnClientConnectionDevicesData.length > 0;

	const displayTableData = withContent ? (
		vpnClientConnectionDevicesData
			.slice(pageViseted, pageViseted + totalPaginationPages)
			// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
			.map((item, key) => <TableRow key={key}>{tableCells(item)}</TableRow>)
	) : (
		<TableRow>
			<TableCell colSpan={100}>
				{devicesFetchStatus === "rejected" ? (
					<ErrorScreen />
				) : devicesFetchStatus === "pending" ? (
					<Loader />
				) : (
					<div className="empty-table">{t("listEmpty")}</div>
				)}
			</TableCell>
		</TableRow>
	);

	const onDeleteSubmit = (instance) => {
		return dispatch(
			deleteVpnClientConnectionDeviceAndFetch(instance.id, connectionId),
		);
	};

	return (
		<>
			<ButtonBack back={t("back")} path={".."} />

			<h3 className="title" color="blue">
				{capitalizeFirstLetter(vpnClientConnectionData.name || longDash)}
			</h3>
			<h4>{t("clientConnectionDetails")}</h4>
			<div className="details-container">
				<div className="details">
					<div>{t("subnet")}</div>
					<div>{t("endpoint")}</div>
				</div>
				<div className="details">
					<div>{vpnClientConnectionData.subnet || longDash}</div>
					<div>
						{vpnGatewayData.hostname
							? `${vpnGatewayData.hostname}:${vpnClientConnectionData.port}`
							: longDash}
					</div>
				</div>
			</div>
			<div className="customized-hr" />
			<div className="table-title-container">
				<h4>{t("devices")}</h4>
				<div className="table-title-container-controls">
					<VpnApiButton info={apiButtonInfo.vpnDevices(connectionId)} />
					<Button type="button" onClick={onAddDevice}>
						{t("addDevice")}
					</Button>
					{/* <VpnModal
								formFields={[
									"name",
									"ip",
									"publicKey",
									"routeSubnets",
									"keepAlive",
								]}
								addContentMessage={"addDevice"}
								managementName="vpnDevices"
							/> */}
				</div>
			</div>

			<div className="devices-table-wrapper">
				<Table
					className="devices-table"
					containerClassName={withContent ? "" : "no-content"}
				>
					<TableHeader>
						<TableRow>{displayHeaders}</TableRow>
					</TableHeader>

					<TableBody>{displayTableData}</TableBody>
				</Table>
			</div>

			{withContent && (
				<CustomPagination
					data={vpnClientConnectionDevicesData}
					totalPaginationPages={10}
					setActivePageNumber={setActivePageNumber}
					activePageNumber={activePageNumber}
				/>
			)}

			<GeneralModal ref={configsModalRef} className="configs_modal">
				{(initialState, onCancel) => (
					<PrivateKeyForm initialValues={initialState} onCancel={onCancel} />
				)}
			</GeneralModal>
			<GeneralModal ref={deviceModalRef}>
				{(initialState, onCancel) => (
					<VpnDeviceForm initialValues={initialState} onCancel={onCancel} />
				)}
			</GeneralModal>
			<GeneralModal
				ref={deleteModalRef}
				title={"deleteDevice"}
				onSubmit={onDeleteSubmit}
				isDelete
			>
				{(initialState) => (
					<p>
						<Trans
							i18nKey={"deleteDeviceWarningMessage"}
							values={{ name: initialState.name }}
						/>
					</p>
				)}
			</GeneralModal>
		</>
	);
};

export default ClientConnectionDevices;
