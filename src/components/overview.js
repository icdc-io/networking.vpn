import React from 'react';
import { Redirect, withRouter, Switch, Route } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';
import { vpnGatewayPath, vpnGatewaysPath, vpnClientConnectionDevicesPath } from '../constants/routes';

const Vpn = React.lazy(() => import('./vpn'));
const VpnDetails = React.lazy(() => import('./vpnDetails'));
const ClientConnectionDevices = React.lazy(() => import('./clientConnectionDevices'));

const VpnOverview = () => {
    return (
        <Segment
            style={{ minHeight: 792 }}
        >
            <Switch>
                <Route exact path={vpnGatewaysPath()} component={Vpn} />
                <Route exact path={vpnGatewayPath()} component={VpnDetails} />
                <Route exact path={vpnClientConnectionDevicesPath()} component={ClientConnectionDevices} />
                <Redirect to={`/vpn/gateways`} />
            </Switch>
        </Segment>
    );
};

VpnOverview.propTypes = {
    intl: PropTypes.any
};

export default withRouter(VpnOverview);
