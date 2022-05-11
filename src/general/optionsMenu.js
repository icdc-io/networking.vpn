/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import DeleteModal from './deleteModal';
import VpnModal from '../components/vpnModal';

const OptionsMenu = ({ t, type, instance, options, onClickAction }) => {
    const actions = {
        vpnClientConnections: {
            edit: (clientConnection, key) =>
                <VpnModal
                    t={t}
                    edit
                    key={key}
                    data={clientConnection}
                    formFields={['name', 'ip', 'port', 'mtu']}
                    editContentMessage={'editClientConnection'}
                    managementName='clientConnections'
                />,
            delete: (clientConnection, key) => <DeleteModal t={t} key={key} type={type} instance={clientConnection} />
        },
        vpnPeerGateways: {
            edit: (peerGateway, key) =>
                <VpnModal
                    t={t}
                    edit
                    key={key}
                    data={peerGateway}
                    formFields={['name', 'ip', 'peerEndpoint', 'publicKey', 'routeSubnets']}
                    editContentMessage={'editPeerGateway'}
                    managementName='peerGateways'
                />,
            delete: (peerGateway, key) => <DeleteModal t={t} key={key} type={type} instance={peerGateway} />
        },
        vpnNatMapping: {
            edit: (natResource, key) =>
                <VpnModal
                    t={t}
                    edit
                    key={key}
                    data={natResource}
                    formFields={['hostname', 'vpnIp', 'localIp']}
                    editContentMessage={'editNatMapping'}
                    managementName='natMapping'
                />,
            delete: (natResource, key) => <DeleteModal t={t} key={key} type={type} instance={natResource} />
        },
        gateways: {
            edit: (vpn, key) => <VpnModal
                t={t}
                key={key}
                edit
                data={vpn}
                formFields={['name', 'natSubnet']}
                editContentMessage={'editGateway'}
                managementName='gateway'
            />
        },
        vpnDevices: {
            edit: (device, key) =>
                <VpnModal
                    t={t}
                    edit
                    key={key}
                    data={device}
                    formFields={['name', 'ip', 'publicKey', 'routeSubnets']}
                    editContentMessage={'editDevice'}
                    managementName='vpnDevices'
                />,
            delete: (device, key) => <DeleteModal t={t} key={key} type={type} instance={device} />,
            enable: (key) =>
                <Dropdown.Item key={key} text={t(instance.status ? 'disable' : 'enable')} onClick={onClickAction} />,
            configs: (device, key) =>
            <VpnModal
            t={t}
            privateKey
            key={key}
            data={device}
            formFields={['privateKey']}
            editContentMessage={'enterPrivatekey'}
            managementName='privateKey'
        />,
        }
    };

    return (
        <Dropdown direction='left' icon='ellipsis vertical' className='users-list__actions_dot'>
            <Dropdown.Menu>
                {options.map((option, key) => actions[type][option](instance, key))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

OptionsMenu.propTypes = {
    t: PropTypes.func,
    instance: PropTypes.object,
    type: PropTypes.string,
    options: PropTypes.array,
    onClickAction: PropTypes.func
};

export default OptionsMenu;
