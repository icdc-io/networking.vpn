import React, { useState, useCallback } from 'react';
import { injectIntl } from 'react-intl';
import { Modal, Button, Header, Dropdown, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import messages from '../Messages';
import {
    // deleteVpnGatewayAndFetch,
    deleteVpnClientConnectionAndFetch,
    deleteVpnPeerGatewayAndFetch,
    deleteVpnNatMappingAndFetch,
    deleteVpnClientConnectionDeviceAndFetch
} from '../AppActions';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { vpnGatewaysPath } from '../Constants/routes';

const DeleteModal = ({ type, instance, intl, icon, button, history }) => {
    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useDispatch();

    const types = {
        // vpnGateway: { // Temporary disabled
        //     item: messages.delete,
        //     header: messages.deleteGateway,
        //     content: [messages.deleteGatewayWarningMessage],
        //     textOptions: { name: instance.name },
        //     deleteAction: useCallback(
        //         () => {
        //             dispatch(deleteVpnGatewayAndFetch(instance.id));
        //             button && history.push(vpnGatewaysPath());
        //         },
        //         [dispatch, instance.id, button, history]
        //     )
        // },
        vpnClientConnections: {
            item: messages.delete,
            header: messages.deleteClientConnection,
            content: [messages.deleteClientConnectionWarningMessage],
            textOptions: { name: instance.name },
            deleteAction: useCallback(
                () => {
                    dispatch(deleteVpnClientConnectionAndFetch(instance.id, instance.gatewayId));
                },
                [dispatch, instance.id, instance.gatewayId]
            )
        },
        vpnPeerGateways: {
            item: messages.delete,
            header: messages.deletePeerGateway,
            content: [messages.deletePeerGatewayWarningMessage],
            textOptions: { name: instance.name },
            deleteAction: useCallback(
                () => {
                    dispatch(deleteVpnPeerGatewayAndFetch(instance.id, instance.gatewayId));
                },
                [dispatch, instance.id, instance.gatewayId]
            )
        },
        vpnNatMapping: {
            item: messages.delete,
            header: messages.deleteNatMapping,
            content: [messages.deleteNatMappingWarningMessage],
            textOptions: { name: instance.name },
            deleteAction: useCallback(
                () => {
                    dispatch(deleteVpnNatMappingAndFetch(instance.id, instance.gatewayId));
                },
                [dispatch, instance.id, instance.gatewayId]
            )
        },
        vpnDevices: {
            item: messages.delete,
            header: messages.deleteDevice,
            content: [messages.deleteDeviceWarningMessage],
            textOptions: { name: instance.name },
            deleteAction: useCallback(
                () => {
                    dispatch(deleteVpnClientConnectionDeviceAndFetch(instance.id, instance.connectionId));
                },
                [dispatch, instance.id, instance.connectionId]
            )
        }
    };

    const showModal = () => {
        setIsVisible(true);
    };

    const closeModal = () => {
        setIsVisible(false);
    };

    const onConfirm = () => {
        closeModal();
        types[type].deleteAction(instance);
    };

    const modalText = (modalContent, textOptions) => modalContent.map((text, index) =>
        <Modal.Description as='p' content={intl.formatMessage(text, textOptions)} key={index} />);

    const modalTextWithName = (modalContent) => <Modal.Description as='p' content={intl.formatMessage(modalContent[0], modalContent[1])} />;

    const hasAssignedVms = type === 'networks' && instance.assignedVms && instance.assignedVms.length > 0;

    const buttonModal = button ?
        <Button
            onClick={showModal}
            basic size='tiny' color='red'
            content={intl.formatMessage(types[type].item)}
            className='delete'
            disabled={hasAssignedVms}
        /> :
        icon ?
            <Icon name="trash alternate outline" onClick={showModal} />
            :
            <Dropdown.Item onClick={showModal} className='delete'>{intl.formatMessage(types[type].item)}</Dropdown.Item>;

    return (
        window.insights.getRole() === 'admin' && <>
            {buttonModal}
            <Modal open={isVisible} size='mini' onClick={closeModal} closeIcon>
                <Header as='h3' content={intl.formatMessage(types[type].header)} />
                <Modal.Content content={modalText(types[type].content, types[type].textOptions || {})} />
                {types[type].contentNamed && <Modal.Content content={modalTextWithName(types[type].contentNamed)} />}
                <Modal.Actions align='center'>
                    <Button onClick={closeModal} content={intl.formatMessage(messages.cancel)} />
                    <Button
                        color='red'
                        type='submit'
                        onClick={onConfirm}
                        content={intl.formatMessage(type === 'networks' ? messages.delete : messages.confirm)}
                    />
                </Modal.Actions>
            </Modal>
        </>
    );
};

DeleteModal.propTypes = {
    type: PropTypes.string,
    instance: PropTypes.object,
    intl: PropTypes.any,
    button: PropTypes.bool,
    icon: PropTypes.bool,
    history: PropTypes.object
};

export default injectIntl(withRouter(DeleteModal));
