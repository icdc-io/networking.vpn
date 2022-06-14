import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { Header, Loader, Popup, Table } from 'semantic-ui-react';
import {
    fetchVpnClientConnection,
    fetchVpnClientConnectionDevices,
    fetchVpnGateway,
    updateVpnClientConnectionDeviceAndFetch
} from '../AppActions';
import { vpnGatewayPath } from '../constants/routes';
import ButtonBack from '../general/buttonBack';
import './clientConnectionDevices.scss';
import { dataStatusCheck, formatClientConnectionData, formatDevicesData, formatVpnGatewaysData } from './tools';
import { capitalizeFirstLetter, longDash, truncate } from './tools';
import StatusLabel from './statusLabel';
import DeviceStatistics from './deviceStatistics';
import CustomPagination from '../general/customPagination';
import OptionsMenu from '../general/optionsMenu';
import VpnModal from './vpnModal';
import VpnCopyButton from './vpnCopyButton';
const ApiButton = React.lazy(() => import('container/ApiButton'));

const ClientConnectionDevices = ({ t, history }) => {
    const { connectionId } = useParams();
    const dispatch = useDispatch();
    const { account = '', location = '', role = '' } = useSelector(state => state.host.user);
    const [activePageNumber, setActivePageNumber] = useState(1);
    const totalPaginationPages = 10;
    const pageViseted = totalPaginationPages * (activePageNumber - 1);
    const vpnClientConnectionDevicesData = useSelector(state => formatDevicesData(state.VpnStore.vpnClientConnectionDevices));
    const vpnClientConnectionData = useSelector(state => formatClientConnectionData(state.VpnStore.vpnClientConnection));
    const vpnGatewayData = useSelector(state => formatVpnGatewaysData(state.VpnStore.gateway));
    const devicesFetchStatus = useSelector(state => state.VpnStore.vpnClientConnectionDevicesFetchStatus);
    const clientConnectionFetchStatus = useSelector(state => state.VpnStore.vpnClientConnectionFetchStatus);
    // const gatewayFetchStatus = useSelector(state => state.VpnStore.gatewayFetchStatus);
    const headers = ['name', 'ip', 'publicKey', 'status', 'sent', 'received', 'lastConnection', ''];

    const user = useSelector(state => state.host.user);
    const baseUrls = useSelector(state => state.host.baseUrls);

    const ws = useRef(null);

    window.goToRootRoute = () => history.push('/vpn');

    // useEffect(() => {
    //     if (account) {
    //         ws.current = new WebSocket('ws://10.254.20.22:3000/ws?dev_id[]=1&dev_id[]=2', ['actioncable-v1-json', window.insights.getToken(), account]);
    //         ws.current.onopen = () => {
    //             console.log('open')
    //             const subscribe_msg = {
    //                 command: 'subscribe',
    //                 identifier: JSON.stringify({channel: 'DeviceStatisticChannel'})
    //             };
    //             ws.current.send(JSON.stringify(subscribe_msg));
    //             console.log("Соединение открыто");
    //         }
    //         ws.current.onclose = () => console.log("Соединение закрыто");
    //         gettingData();
    //     }
    // }, [account]);

    // useEffect(() => {
    //     return () => ws.current.close();
    // }, []);

    // const gettingData = useCallback(() => {
    //     if (!ws.current) return;

    //     ws.current.onmessage = e => {
    //         const message = JSON.parse(e.data);
    //         if (message.type === "ping") {
    //             return;
    //         }
    //         console.log("FROM RAILS: ", message);
    //         console.log(message);
    //     };
    // }, []);

    // const vpnClientConnectionDevicesData = formatDevicesData(devices); //Uncomment to test pagintaion

    useEffect(() => {
        if (location && connectionId) {
            dispatch(fetchVpnClientConnection(connectionId));
            dispatch(fetchVpnClientConnectionDevices(connectionId));
        }
    }, [dispatch, account, location, role, connectionId]);

    useEffect(() => {
        vpnClientConnectionData.gatewayId && dispatch(fetchVpnGateway(vpnClientConnectionData.gatewayId));
    }, [dispatch, account, location, role, vpnClientConnectionData.gatewayId]);

    const formatDate = item => {
        if (item) {
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: 'true'
            };

            return (new Date(item).toLocaleString('en-GB', options));
        }

        return;
    };

    const displayHeaders = headers.map((header, key) => (
        <Table.HeaderCell key={key} style={header === 'status' ? { paddingLeft: 40 } : {}}>
            {header !== '' ? t([header]) : ''}
        </Table.HeaderCell>
    ));

    const enableOrDisableDevice = data => {
        dispatch(updateVpnClientConnectionDeviceAndFetch(data.id, data.connectionId, {
            name: data.name,
            ip: data.ip,
            // eslint-disable-next-line camelcase
            public_key: data.publicKey,
            keepalived: data.keepAlive,
            enabled: !data.status,
            subnets: data.routeSubnets,
            owner: data.owner
        }));
    };

    const returnPopupContent = {
        publicKey: (content) => ({
            cellContent: truncate(content, 12),
            popupContent: (
                <div className='flex'>
                    <div>{content}</div>
                    <VpnCopyButton copiedContent={content} />
                </div>
            )
        })
    };

    const addPopup = (content, header) => {
        const { cellContent, popupContent } = returnPopupContent[header](content);

        return (
            <div className='flex'>
                {cellContent || content}
                &ensp;
                {cellContent && (
                    <Popup
                        on='click'
                        pinned
                        trigger={<div className='popup-dots'>...</div>}
                        inverted
                        className='vpn'
                    >
                        {popupContent}
                    </Popup>
                )}
            </div>
        );
    };

    const tableCells = data => headers.map((header, key) => {
        let content = data[header] || longDash;

        if (header === 'publicKey') {
            content = data[header] ? addPopup(content, header) : longDash;
        } else if (header === 'status') {
            content = (<StatusLabel t={t} active={data[header]} />);
        } else if (header === 'sent' || header === 'received') {
            content = (<DeviceStatistics statisticsData={data.statistics} field={header} />);
        } else if (header === 'lastConnection') {
            content = formatDate(data.statistics.lastConnection) || longDash;
        } else if (header === '') {
            content = window.insights.getRole() === 'admin' ? <OptionsMenu
                t={t}
                type='vpnDevices'
                instance={data}
                options={['configs', 'enable', 'edit', 'delete' ]}
                onClickAction={() => enableOrDisableDevice(data)}
            /> : '';
        }

        return (
            <Table.Cell key={key} textAlign={header === '' ? 'right' : 'left'}>
                {content}
            </Table.Cell>
        );
    });

    const displayTableData = vpnClientConnectionDevicesData
        .slice(pageViseted, pageViseted + totalPaginationPages)
        .map((item, key) => <Table.Row key={key}>{tableCells(item)}</Table.Row>);
    return (
        <>
            <ButtonBack back={t('back')} path={vpnGatewayPath(vpnClientConnectionData.gatewayId)} />

            {dataStatusCheck(clientConnectionFetchStatus,t, <>
                <Header as='h3' className='title' color='blue'>{capitalizeFirstLetter(vpnClientConnectionData.name || longDash)}</Header>
                <Header as='h4' style={{ marginTop: 16 }}>{t('clientConnectionDetails')}</Header>
                <div className='details-container'>
                    <div className='details'>
                        <div>{t('subnet')}</div>
                        <div>{t('endpoint')}</div>
                    </div>
                    <div className='details'>
                        <div>{vpnClientConnectionData.subnet || longDash}</div>
                        <div>{`${vpnGatewayData.hostname}:${vpnClientConnectionData.port}` || longDash}</div>
                    </div>
                </div>
                <div className='customized-hr'></div>
                <div className='table-title-container'>
                    <Header as='h4' style={{ marginTop: 16 }}>{t('devices')}</Header>
                    <div className='table-title-container-controls'>
                    <ApiButton element='vpnDevices' connectionId={connectionId} user={user} locationUrl={baseUrls[user.location]} />
                    <VpnModal
                        t={t}
                        formFields={['name', 'ip', 'publicKey', 'routeSubnets', 'keepAlive']}
                        addContentMessage={'addDevice'}
                        managementName='vpnDevices'
                    />
                    </div>
                </div>

                <div className='table-container'>
                    <Table className='devices-table' basic='very' padded>
                        <Table.Header>
                            <Table.Row>{displayHeaders}</Table.Row>
                        </Table.Header>
                        {devicesFetchStatus !== 'pending' && <Table.Body>
                            {displayTableData}
                        </Table.Body>}
                    </Table>
                </div>

                {devicesFetchStatus === 'pending' && <Loader active inline='centered' />}

                <CustomPagination
                    data={vpnClientConnectionDevicesData}
                    totalPaginationPages={10}
                    setActivePageNumber={setActivePageNumber}
                    activePageNumber={activePageNumber}
                />
            </>)}
        </>
    );
};

ClientConnectionDevices.propTypes = {
    intl: PropTypes.any
};

export default withRouter(ClientConnectionDevices);
