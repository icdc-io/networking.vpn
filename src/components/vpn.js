import React, { useEffect, useState } from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Input, Loader } from "semantic-ui-react";
import { fetchVpnGateways } from "../AppActions";
import VpnList from "./vpnList";

const ApiButton = React.lazy(() => import("container/ApiButton"));
const ErrorScreen = React.lazy(() => import("container/ErrorScreen"));

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
      <div className="gw_description">
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
        <ErrorScreen />
      ) : isLoading ? (
        <Loader active inline="centered" />
      ) : (
        <VpnList items={gatewaysData} searchTerm={searchTerm} />
      )}
    </>
  );
};

export default Vpn;
