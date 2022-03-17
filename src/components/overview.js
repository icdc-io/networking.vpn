import React from 'react';
import { Redirect, withRouter, Switch, Route } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';
import { vpnGatewayPath, vpnGatewaysPath, vpnClientConnectionDevicesPath } from '../constants/routes';

const Vpn = React.lazy(() => import('./vpn'));
const VpnDetails = React.lazy(() => import('./vpnDetails'));
const ClientConnectionDevices = React.lazy(() => import('./clientConnectionDevices'));

const VpnOverview = ({ t }) => {
    return (
        <Segment
            style={{ minHeight: 792 }}
        >
            <Switch>
                <Route exact path={vpnGatewaysPath()} render={() => <Vpn t={t} />} />
                <Route exact path={vpnGatewayPath()} render={() => <VpnDetails t={t} />} />
                <Route exact path={vpnClientConnectionDevicesPath()} render={() => <ClientConnectionDevices t={t} />} />
                <Redirect to={`/vpn/gateways`} />
            </Switch>
        </Segment>
    );
};

VpnOverview.propTypes = {
    intl: PropTypes.any
};

export default withRouter(VpnOverview);
