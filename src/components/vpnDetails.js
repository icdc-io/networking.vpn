/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import ButtonBack from '../general/buttonBack';
import { vpnGatewaysPath } from '../constants/routes';
import { useParams, withRouter } from 'react-router-dom';
import { fetchVpnClientConnections, fetchVpnGateway, fetchVpnPeerGateways, fetchVpnNatMapping } from '../AppActions';
import { useDispatch, useSelector } from 'react-redux';
import { dataStatusCheck, formatVpnGatewaysData } from './tools';
import { Header, Icon, Menu } from 'semantic-ui-react';
import './vpnDetails.scss';
import svgVpn from '../static/svgVpn.svg';
import VpnDetailsTable from './vpnDetailsTable';
import { capitalizeFirstLetter, longDash } from './tools';
import VpnModal from './vpnModal';
const ApiButton = React.lazy(() => import('container/ApiButton'));

const VpnDetails = ({ t, history }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const gateway = useSelector(state => formatVpnGatewaysData(state.VpnStore.gateway));
    const gatewayFetchStatus = useSelector(state => state.VpnStore.gatewayFetchStatus);
    const user = useSelector(state => state.host.user);
    const gatewayPublicHostname = gateway.hostname;
    const tabs = ['clientConnections', 'peerGateways', 'natMapping'];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [tableData, setTableData] = useState({
        reduxStateName: 'vpnClientConnections',
        fetchStatus: 'vpnCLientConnectionsFetchStatus'
    });
    const baseUrls = useSelector(state => state.host.baseUrls);

    window.goToRootRoute = () => history.push('/vpn');

    useEffect(() => {
        user.location && dispatch(fetchVpnGateway(id));
    }, [dispatch, id, user]);

    useEffect(() => {
        switch (activeTab) {
            case 'clientConnections':
                dispatch(fetchVpnClientConnections(id));
                setTableData({ ...tableData, reduxStateName: 'vpnClientConnections', fetchStatus: 'vpnClientConnectionsFetchStatus' });
                return;
            case 'peerGateways':
                dispatch(fetchVpnPeerGateways(id));
                setTableData({ ...tableData, reduxStateName: 'vpnPeerGateways', fetchStatus: 'vpnPeerGatewaysFetchStatus' });
                return;
            case 'natMapping':
                dispatch(fetchVpnNatMapping(id));
                setTableData({ ...tableData, reduxStateName: 'vpnNatMapping', fetchStatus: 'vpnNatMappingFetchSatus' });
                return;
        }

    }, [dispatch, activeTab, id, user, user.location, user.role, user.account]);



    const menuItems = [
        {
            name: 'clientConnections',
            menuItem: t('clientConnections'),
            headers: ['name', 'subnet', 'endpoint', ''],
            formFields: ['name', 'ip', 'port', 'mtu'],
            addContentMessage: 'addClientConnection'
        },
        {
            name: 'peerGateways',
            menuItem: t('peerGateways'),
            headers: ['name', 'ip', 'peerEndpoint', 'publicKey', 'routeSubnets', ''],
            formFields: ['name', 'ip', 'peerEndpoint', 'publicKey', 'routeSubnets'],
            addContentMessage: 'addPeerGateway'
        },
        {
            name: 'natMapping',
            menuItem: t('natMapping'),
            headers: ['hostname', 'vpnIp', 'localIp', ''],
            formFields: ['vpnIp', 'localIp', 'hostname'],
            addContentMessage: 'addNatMapping'
        }
    ];

    return (
        <>
            <ButtonBack back={t('back')} path={vpnGatewaysPath()} />

            {dataStatusCheck(gatewayFetchStatus, <>
            <div className='gateway-title-wrapper'>
                <div className='gateway-title'>
                    <img src={svgVpn} />
                    <Header as='h3' className='title' color='blue'>{capitalizeFirstLetter(gateway.name || '')}</Header>
                </div>
                <ApiButton element='vpnGateway' user={user} locationUrl={baseUrls[user.location]} />
            </div>
                <Header as='h4' style={{ marginTop: 16 }}>{t('vpnDetails')}</Header>
                <div className='vpn-details-container'>
                    <div className='vpn-details'>
                        <div>{t('cloudGatewayInstance')}</div>
                        <div>{t('publicKey')}</div>
                        <div>{t('publicHostnameVpn')}</div>
                        <div>{t('internalAddress')}</div>
                        <div>{t('natSubnet')}</div>
                    </div>
                    <div className='vpn-details'>
                        <div>{gateway.cloudGatewayInstance || longDash}</div>
                        <div>{gateway.publicKey || longDash}</div>
                        <div>{gateway.hostname || longDash}</div>
                        <div>{gateway.internalAddress || longDash}</div>
                        <div>{gateway.natSubnet || longDash} <VpnModal 
                            button 
                            t={t}
                            pencil
                            edit
                            data={gateway}
                            formFields={['natSubnet']}
                            editContentMessage={'editNatSubnet'}
                            managementName='gateway'/>
                        </div>
                    </div>
                </div>
                <div className='menu-container'>
                    <Menu pointing secondary color='blue' className='submenu' compact>
                        {menuItems.map((item, key) =>
                            <Menu.Item
                                key={key}
                                name={item.menuItem}
                                active={activeTab === item.name}
                                onClick={() => setActiveTab(item.name)}
                            />
                        )}
                    </Menu>
                    <span></span>
                </div>
                <div className='sub-menu-container'>
                <ApiButton 
                    element={activeTab === 'clientConnections' ? 'vpnConnection' : activeTab === 'peerGateways' ? 'vpnRemoteGateways' : 'vpnNatMapping'} 
                    gatewayId={id} 
                    user={user} 
                    locationUrl={baseUrls[user.location]} />
                    {menuItems.map((item, key) => (
                        activeTab === item.name &&
                        <VpnModal
                            t={t}
                            key={key}
                            formFields={item.formFields}
                            addContentMessage={item.addContentMessage}
                            managementName={activeTab}
                            natSubnet={gateway.natSubnet}
                        />
                    ))}
                </div>
                <VpnDetailsTable
                    t={t}
                    tableName={activeTab}
                    headers={menuItems.filter(item => item.name === activeTab)[0].headers}
                    reduxStateName={tableData.reduxStateName || []}
                    reduxFetchStatus={tableData.fetchStatus}
                    gatewayPublicHostname={gatewayPublicHostname}
                />
            </>)}
        </>
    );
};

VpnDetails.propTypes = {
    t: PropTypes.func
};

export default withRouter(VpnDetails);
