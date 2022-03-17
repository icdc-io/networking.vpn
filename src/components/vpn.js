import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchVpnGateways } from '../AppActions';
// import { gateways } from '../../vpnMockData';
import VpnList from './vpnList';
// import VpnModal from './vpnModal';
const ContentPage = React.lazy(() => import('container/ContentPage'));

const Vpn = ({ t, history }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.host.user);
    const gatewaysData = useSelector(state => state.VpnStore.gateways);
    const gatewaysFetchStatus = useSelector(state => state.VpnStore.gatewaysFetchStatus);

    window.goToRootRoute = () => history.push('/vpn');

    useEffect(() => {
        user.location && dispatch(fetchVpnGateways());
    }, [dispatch, user]);

    return (
        <ContentPage
            t={t}
            statuses={[gatewaysFetchStatus]}
            pageData={gatewaysData}
            title={'vpnGateways'}
            componentDataList={VpnList}
            isTabbedView={false}
            noContentMessage={'noVpnGateways'}
            // componentModal={VpnModal}
        />
    );
};

export default withRouter(Vpn);
