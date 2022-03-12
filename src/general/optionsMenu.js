/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import DeleteModal from './deleteModal';
import messages from '../Messages';
import VpnModal from '../components/vpnModal';

const OptionsMenu = ({ type, instance, options, intl, onClickAction }) => {
    const actions = {
        vpnClientConnections: {
            edit: (clientConnection, key) =>
                <VpnModal
                    edit
                    key={key}
                    data={clientConnection}
                    formFields={['name', 'ip', 'port', 'mtu']}
                    editContentMessage={messages.editClientConnection}
                    managementName='clientConnections'
                />,
            delete: (clientConnection, key) => <DeleteModal key={key} type={type} instance={clientConnection} />
        },
        vpnPeerGateways: {
            edit: (peerGateway, key) =>
                <VpnModal
                    edit
                    key={key}
                    data={peerGateway}
                    formFields={['name', 'ip', 'peerEndpoint', 'publicKey', 'routeSubnets']}
                    editContentMessage={messages.editPeerGateway}
                    managementName='peerGateways'
                />,
            delete: (peerGateway, key) => <DeleteModal key={key} type={type} instance={peerGateway} />
        },
        vpnNatMapping: {
            edit: (natResource, key) =>
                <VpnModal
                    edit
                    key={key}
                    data={natResource}
                    formFields={['hostname', 'vpnIp', 'localIp']}
                    editContentMessage={messages.editNatMapping}
                    managementName='natMapping'
                />,
            delete: (natResource, key) => <DeleteModal key={key} type={type} instance={natResource} />
        },
        gateways: {
            edit: (vpn, key) => <VpnModal
                key={key}
                edit
                data={vpn}
                formFields={['name', 'natSubnet']}
                editContentMessage={messages.editGateway}
                managementName='gateway'
            />
        },
        vpnDevices: {
            edit: (device, key) =>
                <VpnModal
                    edit
                    key={key}
                    data={device}
                    formFields={['name', 'ip', 'publicKey', 'routeSubnets']}
                    editContentMessage={messages.editDevice}
                    managementName='vpnDevices'
                />,
            delete: (device, key) => <DeleteModal key={key} type={type} instance={device} />,
            enable: (key) =>
                <Dropdown.Item key={key} text={intl.formatMessage(instance.status ? messages.disable : messages.enable)} onClick={onClickAction} />
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
    intl: PropTypes.any,
    instance: PropTypes.object,
    type: PropTypes.string,
    options: PropTypes.array,
    onClickAction: PropTypes.func
};

export default injectIntl(OptionsMenu);
