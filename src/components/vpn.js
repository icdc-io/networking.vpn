import React, { useEffect, useState } from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Input, Loader } from "semantic-ui-react";
import { fetchVpnGateways } from "../AppActions";
// import { gateways } from '../../vpnMockData';
import VpnList from "./vpnList";
// import VpnModal from './vpnModal';
// const ContentPage = React.lazy(() => import("container/ContentPage"));
const ApiButton = React.lazy(() => import("container/ApiButton"));

const Vpn = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.host.user);
  const gatewaysData = useSelector((state) => state.VpnStore.gateways);
  const gatewaysFetchStatus = useSelector(
    (state) => state.VpnStore.gatewaysFetchStatus,
  );
  const baseUrls = useSelector((state) => state.host.baseUrls);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    user.location && dispatch(fetchVpnGateways());
  }, [dispatch, user]);

  const isError = gatewaysFetchStatus === "rejected";

  const isLoading = gatewaysFetchStatus === "pending";

  return (
    <>
      <h4>{t("vpnGateways")}</h4>
      <div style={{ color: "#969696", marginBottom: 16 }}>
        {<DangerousHTML html={t("vpnDescription", { tag: "<br />" })} />}
      </div>

      <div className="header">
        <Input
          className="small-input"
          icon="search"
          placeholder={t("search")}
          onChange={(event) => setSearchTerm(event.target.value)}
          value={searchTerm}
        />
        <ApiButton
          element="vpnGateway"
          user={user}
          locationUrl={baseUrls[user.location]}
        />
      </div>
      {isError ? (
        "Error"
      ) : isLoading ? (
        <Loader active inline="centered" />
      ) : (
        <VpnList items={gatewaysData} searchTerm={searchTerm} />
      )}
    </>
  );
};

export default Vpn;
