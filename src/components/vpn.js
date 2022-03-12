import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchVpnGateways } from '../AppActions';
import ContentPage from '../general/contentPage';
import messages from '../Messages';
// import { gateways } from '../../vpnMockData';
import VpnList from './vpnList';
// import VpnModal from './vpnModal';

const Vpn = ({ history }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.host.user);
    const gatewaysData = useSelector(state => state.VpnStore.gateways);
    const gatewaysFetchStatus = useSelector(state => state.VpnStore.gatewaysFetchStatus);

    window.goToRootRoute = () => history.push('/vpn');

    useEffect(() => {
        Object.keys(user).length !== 0 && dispatch(fetchVpnGateways());
    }, [dispatch, user.role, user.location, user.account, user]);

    return (
        <ContentPage
            status={gatewaysFetchStatus}
            pageData={gatewaysData}
            title={messages.vpnGateways}
            componentDataList={VpnList}
            isTabbedView={false}
            noContentMessage={messages.noVpnGateways}
            // componentModal={VpnModal}
        />
    );
};

export default withRouter(Vpn);
