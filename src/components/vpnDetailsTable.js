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
import { isAdminRights } from "container/roleUtils";
import { CircleHelp } from "lucide-react";
import { PropTypes } from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
	deleteVpnClientConnectionAndFetch,
	deleteVpnNatMappingAndFetch,
	deleteVpnPeerGatewayAndFetch,
} from "../AppActions";
import { apiButtonInfo } from "../constants/apiButtonInfo";
import { vpnClientConnectionDevicesPath } from "../constants/routes";
import GeneralModal from "../general/GeneralModal";
import CustomPagination from "../general/customPagination";
import ClientConnectionsForm from "./ClientConnectionsForm";
import NatMappingForm from "./NatMappingForm";
import PeerGatewaysForm from "./PeerGatewaysForm";
import VpnApiButton from "./VpnApiButton";
import { longDash } from "./tools";
import { formatTableData, truncate } from "./tools";

const headersInfo = {
	clientConnections: [
		{
			name: "name",
			value: "name",
		},
		{
			name: "deviceSubnet",
			value: "subnet",
		},
		{
			name: "gateway_ip",
			value: "gateway_ip",
		},
		{
			name: "endpoint",
			value: "endpoint",
		},
		{
			name: "",
			value: "",
		},
	],
	peerGateways: [
		{
			name: "name",
			value: "name",
		},
		{
			name: "deviceSubnet",
			value: "subnet",
		},
		{
			name: "gateway_ip",
			value: "gateway_ip",
		},
		{
			name: "peerEndpoint",
			value: "endpoint",
		},
		{
			name: "publicKey",
			value: "public_key",
		},
		{
			name: "routeSubnets",
			value: "subnets",
		},
		{
			name: "",
			value: "",
		},
	],
	natMapping: [
		{
			name: "hostname",
			value: "host",
		},
		{
			name: "vpn_ip",
			value: "vpn_ip",
		},
		{
			name: "localIp",
			value: "local_ip",
		},
		{
			name: "",
			value: "",
		},
	],
};

const VpnDetailsTable = ({
	tableName,
	reduxStateName,
	reduxFetchStatus,
	gatewayPublicHostname,
}) => {
	const { t } = useTranslation();
	const { id } = useParams();
	const [activePageNumber, setActivePageNumber] = useState(1);
	const totalPaginationPages = 10;
	const pageViseted = totalPaginationPages * (activePageNumber - 1);
	const tableContentFromRedux =
		useSelector((state) => state.VpnStore[reduxStateName]) || [];
	const formattedTableContent = tableContentFromRedux;
	const fetchStatus = useSelector((state) => state.VpnStore[reduxFetchStatus]);
	const user = useSelector((state) => state.host.user);
	const editModalRef = useRef();
	const deleteModalRef = useRef();
	const headers = headersInfo[tableName];
	const dispatch = useDispatch();
	const gateway = useSelector((state) => state.VpnStore.gateway);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setActivePageNumber(1);
	}, [tableName]);

	const displayHeaders = headers.map((header, key) => (
		<TableHead key={header.name}>
			{header.name !== "" ? t([header.name]) : ""}
		</TableHead>
	));

	const routeSubnetsPopup = (subnetsString) =>
		subnetsString.split(",").map((subnetRoute, key) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
			<div key={key} className="flex items-center justify-between">
				<div>{subnetRoute}</div>&nbsp;&nbsp;
				<CopyButton content={subnetRoute} />
			</div>
		));

	const returnPopupContent = {
		publicKey: (content) => ({
			cellContent: truncate(content, 12),
			popupContent: (
				<div className="flex items-center">
					<div>{content}</div>&nbsp;&nbsp;
					<CopyButton content={content} />
				</div>
			),
		}),
		routeSubnets: (content) => ({
			cellContent: truncate(content),
			popupContent: (
				<div className="flex gap-2 flex-col">{routeSubnetsPopup(content)}</div>
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
					<Popup content={popupContent} className="networking-vpn-popup">
						<button className="popup-dots" type="button">
							...
						</button>
					</Popup>
				)}
			</div>
		);
	};

	const onEdit = (instanceData) => (_e) => {
		if (editModalRef.current) {
			editModalRef.current.handleClick(instanceData);
		}
	};

	const onDelete = (instanceData) => (_e) => {
		if (deleteModalRef.current) {
			deleteModalRef.current.handleClick(instanceData);
		}
	};

	const modalInfo = {
		clientConnections: {
			createButton: "addClientConnection",
			isAddingDisabled: false,
			options: [
				{
					text: "edit",
					action: onEdit,
				},
				{
					text: "delete",
					action: onDelete,
					color: "red",
				},
			],
			deleteInfo: {
				title: "deleteClientConnection",
				content: (instanceInfo) => (
					<Trans
						i18nKey={"deleteClientConnectionWarningMessage"}
						values={{ name: instanceInfo.name }}
					/>
				),
				onSubmit: (instanceInfo) => {
					return dispatch(
						deleteVpnClientConnectionAndFetch(instanceInfo.id, id),
					);
				},
			},
			editInfo: {
				form: ClientConnectionsForm,
			},
		},
		peerGateways: {
			createButton: "addPeerGateway",
			isAddingDisabled: false,
			options: [
				{
					text: "edit",
					action: onEdit,
				},
				{
					text: "delete",
					action: onDelete,
					color: "red",
				},
			],
			deleteInfo: {
				title: "deletePeerGateway",
				content: (instanceInfo) => (
					<Trans
						i18nKey={"deletePeerGatewayWarningMessage"}
						values={{ name: instanceInfo.name }}
					/>
				),
				onSubmit: (instanceInfo) =>
					dispatch(deleteVpnPeerGatewayAndFetch(instanceInfo.id, id)),
			},
			editInfo: {
				form: PeerGatewaysForm,
			},
		},
		natMapping: {
			createButton: "addNatMapping",
			isAddingDisabled: !gateway.nat_subnet,
			options: [
				{
					text: "edit",
					action: onEdit,
				},
				{
					text: "delete",
					action: onDelete,
					color: "red",
				},
			],
			deleteInfo: {
				title: "deleteNatMapping",
				content: (instanceInfo) => (
					<Trans
						i18nKey={"deleteNatMappingWarningMessage"}
						values={{ name: instanceInfo.host }}
					/>
				),
				onSubmit: (instanceInfo) =>
					dispatch(deleteVpnNatMappingAndFetch(instanceInfo.id, id)),
			},
			editInfo: {
				form: NatMappingForm,
			},
		},
	};

	const { options, deleteInfo, editInfo, createButton, isAddingDisabled } =
		modalInfo[tableName];
	const EditForm = editInfo.form;

	const tableCells = (data) =>
		headers.map((header) => {
			let content = data[header.value] || longDash;
			if (["publicKey", "routeSubnets"].includes(header.name)) {
				content = addPopup(content, header.name);
			}

			if (tableName === "clientConnections" && header.name === "name") {
				content = (
					<Link to={vpnClientConnectionDevicesPath(data.id)}>{data.name}</Link>
				);
			} else if (
				tableName === "clientConnections" &&
				header.name === "endpoint"
			) {
				content = `${gatewayPublicHostname}:${data.port}`;
			} else if (header.name === "") {
				let type = "clientConnections";

				if (tableName === "clientConnections") {
					type = "vpnClientConnections";
				} else if (tableName === "peerGateways") {
					type = "vpnPeerGateways";
				} else if (tableName === "natMapping") {
					type = "vpnNatMapping";
				}

				content = isAdminRights(user.role) ? (
					<OptionsMenu
						// type={type}
						instance={data}
						options={options}
					/>
				) : null;
			}

			return (
				<TableCell
					key={header.name}
					align={header.name === "" ? "right" : "left"}
				>
					{content}
				</TableCell>
			);
		});

	const determineServiceForEmptyState = {
		clientConnections: { listName: t("emptyClientConnections") },
		peerGateways: { listName: t("emptyPeerGateways") },
		natMapping: { listName: t("emptyNatDevices") },
	};

	const withContent =
		fetchStatus === "fulfilled" && formattedTableContent.length > 0;

	const displayTableData = withContent ? (
		formattedTableContent
			.slice(pageViseted, pageViseted + totalPaginationPages)
			// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
			.map((item, key) => <TableRow key={key}>{tableCells(item)}</TableRow>)
	) : (
		<TableRow>
			<TableCell colSpan={100}>
				{fetchStatus === "rejected" ? (
					<ErrorScreen />
				) : fetchStatus === "pending" ? (
					<Loader />
				) : (
					<div className="empty-table">
						{t("emptyListMessage", determineServiceForEmptyState[tableName])}
					</div>
				)}
			</TableCell>
		</TableRow>
	);

	return (
		<>
			<div className="sub-menu-container">
				<VpnApiButton info={apiButtonInfo[tableName]?.(id)} />
				{!isAdminRights(user.role) ? null : isAddingDisabled ? (
					<Popup content={t("natPopup")}>
						<Button className="disabled-btn ">
							{t(createButton)}&nbsp;&nbsp;
							<CircleHelp size={16} />
						</Button>
					</Popup>
				) : (
					<Button onClick={onEdit()}>{t(createButton)}</Button>
				)}
				{/* {menuItems.map(
                        (item) =>
                          activeTab === item.name && (
                            <VpnModal
                              key={item}
                              formFields={item.createModalFields}
                              addContentMessage={item.addContentMessage}
                              managementName={activeTab}
                              natSubnet={gateway.natSubnet}
                            />
                          ),
                      )} */}
			</div>
			<div className={"details-table-wrapper"}>
				<Table
					className={(withContent ? "" : "no-content ") + " details-table"}
				>
					<TableHeader>
						<TableRow>{displayHeaders}</TableRow>
					</TableHeader>
					<TableBody>{displayTableData}</TableBody>
				</Table>
			</div>

			{withContent && (
				<CustomPagination
					data={formattedTableContent}
					totalPaginationPages={10}
					setActivePageNumber={setActivePageNumber}
					activePageNumber={activePageNumber}
				/>
			)}

			<GeneralModal ref={editModalRef}>
				{(initialState, onCancel) => (
					<EditForm
						initialValues={initialState}
						onCancel={onCancel}
						onSubmit={editInfo.onSubmit}
					/>
				)}
			</GeneralModal>
			<GeneralModal
				ref={deleteModalRef}
				title={deleteInfo.title}
				onSubmit={deleteInfo.onSubmit}
				isDelete
			>
				{(initialState) => <p>{deleteInfo.content(initialState)}</p>}
			</GeneralModal>
		</>
	);
};

VpnDetailsTable.propTypes = {
	tableName: PropTypes.string,
	headers: PropTypes.array,
	reduxStateName: PropTypes.string,
	reduxFetchStatus: PropTypes.string,
	gatewayPublicHostname: PropTypes.string,
};

export default VpnDetailsTable;
