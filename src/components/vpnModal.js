/* eslint camelcase: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Icon, Modal } from 'semantic-ui-react';
import VpnForm from './vpnForm';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    createVpnClientConnectionAndFetch,
    createVpnClientConnectionDeviceAndFetch,
    createVpnNatMappingAndFetch,
    createVpnPeerGatewayAndFetch,
    infoNotification,
    updateVpnClientConnectionAndFetch,
    updateVpnClientConnectionDeviceAndFetch,
    updateVpnNatMappingAndFetch,
    updateVpnPeerGatewayAndFetch,
    editVpnGatewayAndFetch
} from '../AppActions';

const VpnModal = ({ t, edit, pencil, privateKey, data: values, formFields, addContentMessage, editContentMessage, managementName }) => {
    const { id, connectionId } = useParams();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const user = useSelector(state => state.host.user);

    const prepPayloadForSubmitingAndSubmitFunction = (id, formValues) => {
        let payload = {};
        /* eslint-disable */
        switch (managementName) {
            case 'clientConnections':
                payload = {
                    name: formValues.name,
                    ip: formValues.ip,
                    port: parseInt(formValues.port),
                    mtu: parseInt(formValues.mtu)
                };

                return edit ? updateVpnClientConnectionAndFetch(id, formValues.id, payload) : createVpnClientConnectionAndFetch(id, payload);
            case 'peerGateways':
                payload = {
                    name: formValues.name,
                    endpoint: formValues.peerEndpoint,
                    ip: formValues.ip,
                    public_key: formValues.publicKey,
                    subnets: formValues.routeSubnets.join(',')
                };

                return edit ? updateVpnPeerGatewayAndFetch(id, formValues.id, payload) : createVpnPeerGatewayAndFetch(id, payload);
            case 'natMapping':
                payload = {
                    vpn_ip: formValues.vpnIp,
                    local_ip: formValues.localIp,
                    host: formValues.hostname
                };

                return edit ? updateVpnNatMappingAndFetch(id, formValues.id, payload) : createVpnNatMappingAndFetch(id, payload);
            case 'gateway':
                payload = {
                    name: formValues.name,
                    nat_subnet: formValues.natSubnet
                };

                return editVpnGatewayAndFetch(formValues.id, payload);
            case 'vpnDevices':
                payload = {
                    name: formValues.name,
                    ip: formValues.ip,
                    public_key: formValues.publicKey,
                    keepalived: formValues.keepalived || 0,
                    enabled: true,
                    // subnets: formValues.routeSubnets,
                    // owner: 'pnkazlou@ibagroup.eu'
                    subnets: formValues.routeSubnets.join(','),
                    owner: user.email
                }
                return edit ? updateVpnClientConnectionDeviceAndFetch(formValues.id, connectionId, payload) :
                    createVpnClientConnectionDeviceAndFetch(connectionId, payload)
            case 'privateKey':
                payload = {
                    privateKey: formValues.privateKey,
                }
                return edit ? updateVpnClientConnectionDeviceAndFetch(formValues.id, connectionId, payload) :
                    createVpnClientConnectionDeviceAndFetch(connectionId, payload)
        }
        /* eslint-enable */
    };

    const onSubmit = values => {
        let messageText = '';
        if (managementName === 'clientConnections') {
            messageText = 'creatingClientConnection';
        } else if (managementName === 'peerGateways') {
            messageText = 'creatingPeerGateway';
        } else if (managementName === 'vpnDevices') {
            messageText = 'creatingDevice';
        } else {
            messageText = 'creatingNatMapping';
        }

        !edit && infoNotification(t([messageText]));
        dispatch(prepPayloadForSubmitingAndSubmitFunction(id, values));
        handleClose();
    };

    const button = (edit && !pencil) ?
        <Dropdown.Item text={t('edit')} onClick={() => setOpen(true)} /> 
        : (pencil && edit) 
        ? <Icon name="pencil alternate" className='pencil' onClick={() => setOpen(true)} /> 
        : privateKey ?  <Dropdown.Item text={t('configs')} onClick={() => setOpen(true)} />  : <Button
            color='blue' size='small' onClick={() => setOpen(true)}>
            {t(addContentMessage)}
        </Button>;

    return (
        window.insights.getRole() === 'admin' && <>
            {button}
            <Modal
                size='tiny'
                open={open}
                onClose={handleClose}
                closeIcon
            >
                <Modal.Header content={t(editContentMessage || addContentMessage)} />
                <Modal.Content style={{paddingTop: '0'}}>
                    <VpnForm
                        t={t}
                        handleClose={handleClose}
                        onSubmit={onSubmit}
                        initialValues={(edit || privateKey) && values}
                        fieldNames={formFields}
                        edit={edit}
                        pencil={pencil}
                        privateKey={privateKey}
                        managementName={managementName}
                    />
                </Modal.Content>
            </Modal>
        </>
    );
};

VpnModal.propTypes = {
    t: PropTypes.func,
    edit: PropTypes.bool,
    data: PropTypes.any,
    formFields: PropTypes.array,
    addContentMessage: PropTypes.any,
    editContentMessage: PropTypes.any,
    managementName: PropTypes.any
};

export default VpnModal;
