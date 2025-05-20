import { Segment } from "container/Segment";
import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
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
		<Segment className="networking_vpn h-full">
			<React.Suspense fallback={null}>
				<Routes>
					<Route path={"/"} Component={RootComponent}>
						<Route index Component={Vpn} />
						<Route path={vpnGatewayPath()} Component={RootComponent}>
							<Route index Component={VpnDetails} />
							<Route
								path={`${vpnClientConnectionDevicesPath()}`}
								Component={ClientConnectionDevices}
							/>
						</Route>
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
