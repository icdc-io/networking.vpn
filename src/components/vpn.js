import { Input } from "container/Input";
import { useEffect, useState } from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchVpnGateways } from "../AppActions";
import { apiButtonInfo } from "../constants/apiButtonInfo";
import searchMethod from "../utilities/searchFunction";
import VpnApiButton from "./VpnApiButton";
import VpnList from "./vpnList";

const Vpn = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.host.user);
	const gatewaysData = useSelector((state) => state.VpnStore.gateways);
	const gatewaysFetchStatus = useSelector(
		(state) => state.VpnStore.gatewaysFetchStatus,
	);
	// const baseUrls = useSelector((state) => state.host.baseUrls);

	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		user.location && dispatch(fetchVpnGateways());
	}, [dispatch, user]);

	return (
		<>
			<h2 className="page-title">{t("vpnGateways")}</h2>
			<div className="gw_description">
				{<DangerousHTML html={t("vpnDescription", { tag: "<br />" })} />}
			</div>

			<div className="flex justify-between items-center">
				<div className="small-input">
					<Input
						variant="search"
						placeholder={t("search")}
						onChange={(event) => setSearchTerm(event.target.value)}
						value={searchTerm}
					/>
				</div>

				<VpnApiButton info={apiButtonInfo.vpnGateway} />
			</div>
			<VpnList
				items={searchMethod(
					gatewaysData,
					searchTerm,
					["name", "publicKey", "hostname", "natSubnet"],
					["natSubnet"],
				)}
				status={gatewaysFetchStatus}
			/>
		</>
	);
};

export default Vpn;
