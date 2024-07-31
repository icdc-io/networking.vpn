import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Segment } from "semantic-ui-react";
import {
  vpnGatewayPath,
  vpnGatewaysPath,
  vpnClientConnectionDevicesPath,
} from "../constants/routes";

const Vpn = React.lazy(() => import("./vpn"));
const VpnDetails = React.lazy(() => import("./vpnDetails"));
const ClientConnectionDevices = React.lazy(
  () => import("./clientConnectionDevices"),
);

const VpnOverview = () => {
  return (
    <Segment style={{ minHeight: 792 }}>
      <React.Suspense fallback={null}>
        <Routes>
          <Route path={vpnGatewaysPath()} Component={Vpn} />
          <Route path={vpnGatewayPath()} Component={VpnDetails} />
          <Route
            path={`${vpnGatewayPath()}/${vpnClientConnectionDevicesPath()}`}
            Component={ClientConnectionDevices}
          />
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
