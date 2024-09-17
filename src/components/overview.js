import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Segment } from "semantic-ui-react";
import {
  vpnClientConnectionDevicesPath,
  vpnGatewayPath,
  vpnGatewaysPath,
} from "../constants/routes";

const Vpn = React.lazy(() => import("./vpn"));
const VpnDetails = React.lazy(() => import("./vpnDetails"));
const ClientConnectionDevices = React.lazy(
  () => import("./clientConnectionDevices"),
);

const RootComponent = () => {
  return <Outlet />;
};

const VpnOverview = () => {
  return (
    <Segment className="networking_vpn">
      <React.Suspense fallback={null}>
        <Routes>
          <Route path={vpnGatewaysPath()} Component={RootComponent}>
            <Route index Component={Vpn} />
            <Route path={vpnGatewayPath()} Component={VpnDetails} />
            <Route
              path={`${vpnGatewayPath()}/${vpnClientConnectionDevicesPath()}`}
              Component={ClientConnectionDevices}
            />
          </Route>
          <Route
            path="*"
            element={<Navigate to={vpnGatewaysPath()} replace />}
          />
        </Routes>
      </React.Suspense>
    </Segment>
  );
};

export default VpnOverview;
