import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import OptionsMenu from "container/OptionsMenu";
import Paginator from "container/Paginator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "container/Table";
import { isAdminRights } from "container/roleUtils";
import _ from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { editVpnGatewayAndFetch } from "../AppActions";
import GeneralModal from "../general/GeneralModal";
import svgVpn from "../static/svgVpn.svg";
import searchMethod from "../utilities/searchFunction";
import GatewayForm from "./GatewayForm";
import { longDash } from "./tools";

const headers = [
	{ name: "name", headerName: "name", sortable: true },
	{ name: "publicKey", headerName: "publicKey", sortable: false },
	{ name: "hostname", headerName: "publicHostnameVpn", sortable: false },
	{ name: "natSubnet", headerName: "natSubnet", sortable: false },
	{ name: "menu", headerName: "", sortable: false },
];

const VpnList = ({ items: gatewaysData, status }) => {
	const { t } = useTranslation();
	const userRole = useSelector((state) => state.host.user.role);
	const [direction, setDirection] = useState("ascending");
	const [column, setColumn] = useState(null);
	const [gateways, setGateways] = useState([]);
	const [activePageNumber, setActivePageNumber] = useState(1);
	const totalPaginationPages = 8;
	const pageViseted = totalPaginationPages * (activePageNumber - 1);
	const gatewayModalRef = useRef();

	useEffect(() => {
		setGateways(gatewaysData);
		setActivePageNumber(1);
	}, [gatewaysData]);

	const handleSort = (columnName) => {
		if (column !== columnName) {
			setColumn(columnName);
			setGateways(_.sortBy(gateways, [columnName]));
			setDirection("ascending");
			return;
		}

		direction === "ascending"
			? setDirection("descending")
			: setDirection("ascending");
		setGateways(gateways.reverse());
	};

	const displayHeaders = headers.map((item, key) => (
		<TableHead
			key={item.name}
			sorted={column === item.name ? direction : null}
			onClick={() => {
				if (item.sortable) {
					handleSort(item.name);
				}
			}}
		>
			{item.headerName ? t(item.headerName) : ""}
		</TableHead>
	));

	const onEditGateway = (gatewayData) => (_e) => {
		if (gatewayModalRef.current) {
			gatewayModalRef.current.handleClick(gatewayData);
		}
	};

	const options = [
		{
			text: "edit",
			action: onEditGateway,
		},
	];

	const tableCells = (gateway) => {
		const tableRow = headers.map((header, key) => {
			let content = gateway[header.name];

			if (header.name === "name") {
				content = (
					<div className="gateway-name-container">
						<img src={svgVpn} alt="Gateway" />
						<Link to={`${gateway.id}`}>{content}</Link>
					</div>
				);
			}
			// if (header.name === 'natSubnet') {
			//     content = <>{content} <VpnModal
			//     button
			//     pencil
			//     edit
			//     data={gateway}
			//     formFields={['natSubnet']}
			//     editContentMessage={'editNatSubnet'}
			//     managementName='gateway'/></>;
			// }

			if (header.name === "menu") {
				content = isAdminRights(userRole) ? (
					<OptionsMenu instance={gateway} options={options} />
				) : (
					" "
				);
			}
			// else if (header.name === 'deleteButton') {
			//     content = (<DeleteModal icon type='gateway' instance={vpnGateway} />);
			// }

			return (
				<TableCell
					key={header.name}
					align={header.name === "menu" ? "right" : "left"}
				>
					{content || longDash}
				</TableCell>
			);
		});
		return tableRow;
	};

	const displayTableData = gateways
		.slice(pageViseted, pageViseted + totalPaginationPages)
		// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
		.map((item, key) => <TableRow key={key}>{tableCells(item)}</TableRow>);

	const fullCellWidth = (content) => {
		return (
			<TableRow>
				<TableCell colSpan={100}>
					<div className="empty-cell">{content}</div>
				</TableCell>
			</TableRow>
		);
	};

	return (
		<div className="vpn-list">
			<div className="table-container ">
				<Table className="vpn-list-table">
					<TableHeader>
						<TableRow>{displayHeaders}</TableRow>
					</TableHeader>
					<TableBody>
						{status === "pending"
							? fullCellWidth(<Loader />)
							: status === "rejected"
								? fullCellWidth(<ErrorScreen />)
								: gateways.length
									? displayTableData
									: fullCellWidth(
											<h3 className="empty-table">{t("listEmpty")}</h3>,
										)}
					</TableBody>
				</Table>
			</div>
			{gateways.length > totalPaginationPages && (
				<div className={"custom-pagination"}>
					<Paginator
						currentPage={activePageNumber}
						onPageChange={setActivePageNumber}
						totalPages={Math.ceil(gateways.length / totalPaginationPages)}
					/>
				</div>
			)}
			<GeneralModal title="editGateway" ref={gatewayModalRef}>
				{(initialState, onCancel) => (
					<GatewayForm initialValues={initialState} onCancel={onCancel} />
				)}
			</GeneralModal>
		</div>
	);
};

VpnList.propTypes = {
	items: PropTypes.array,
	status: PropTypes.string,
};

export default VpnList;
