import PropTypes from "prop-types";
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Header, Icon, Modal } from "semantic-ui-react";
import {
  // deleteVpnGatewayAndFetch,
  deleteVpnClientConnectionAndFetch,
  deleteVpnClientConnectionDeviceAndFetch,
  deleteVpnNatMappingAndFetch,
  deleteVpnPeerGatewayAndFetch,
} from "../AppActions";
// import { vpnGatewaysPath } from '../Constants/routes';

const DeleteModal = ({ type, instance, icon, button }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const user = useSelector((state) => state.host.user);

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
      item: "delete",
      header: "deleteClientConnection",
      content: ["deleteClientConnectionWarningMessage"],
      textOptions: { name: instance.name },
      deleteAction: useCallback(() => {
        dispatch(
          deleteVpnClientConnectionAndFetch(instance.id, instance.gatewayId),
        );
      }, [dispatch, instance.id, instance.gatewayId]),
    },
    vpnPeerGateways: {
      item: "delete",
      header: "deletePeerGateway",
      content: ["deletePeerGatewayWarningMessage"],
      textOptions: { name: instance.name },
      deleteAction: useCallback(() => {
        dispatch(deleteVpnPeerGatewayAndFetch(instance.id, instance.gatewayId));
      }, [dispatch, instance.id, instance.gatewayId]),
    },
    vpnNatMapping: {
      item: "delete",
      header: "deleteNatMapping",
      content: ["deleteNatMappingWarningMessage"],
      textOptions: { name: instance.name },
      deleteAction: useCallback(() => {
        dispatch(deleteVpnNatMappingAndFetch(instance.id, instance.gatewayId));
      }, [dispatch, instance.id, instance.gatewayId]),
    },
    vpnDevices: {
      item: "delete",
      header: "deleteDevice",
      content: ["deleteDeviceWarningMessage"],
      textOptions: { name: instance.name },
      deleteAction: useCallback(() => {
        dispatch(
          deleteVpnClientConnectionDeviceAndFetch(
            instance.id,
            instance.connectionId,
          ),
        );
      }, [dispatch, instance.id, instance.connectionId]),
    },
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

  const modalText = (modalContent, textOptions) =>
    modalContent.map((text, index) => (
      <Modal.Description as="p" content={t(text, textOptions)} key={index} />
    ));

  const modalTextWithName = (modalContent) => (
    <Modal.Description as="p" content={t(modalContent[0], modalContent[1])} />
  );

  const hasAssignedVms =
    type === "networks" &&
    instance.assignedVms &&
    instance.assignedVms.length > 0;

  const buttonModal = button ? (
    <Button
      onClick={showModal}
      basic
      size="tiny"
      color="red"
      content={t(types[type].item)}
      className="delete"
      disabled={hasAssignedVms}
    />
  ) : icon ? (
    <Icon name="trash alternate outline" onClick={showModal} />
  ) : (
    <Dropdown.Item onClick={showModal} className="delete">
      {t(types[type].item)}
    </Dropdown.Item>
  );

  return (
    (user.role === "admin" || type === "vpnDevices") && (
      <>
        {buttonModal}
        <Modal open={isVisible} size="mini" onClick={closeModal} closeIcon>
          <Header as="h3" content={t(types[type].header)} />
          <Modal.Content
            content={modalText(
              types[type].content,
              types[type].textOptions || {},
            )}
          />
          {types[type].contentNamed && (
            <Modal.Content
              content={modalTextWithName(types[type].contentNamed)}
            />
          )}
          <Modal.Actions align="center">
            <Button onClick={closeModal} content={t("cancel")} />
            <Button
              color="red"
              type="submit"
              onClick={onConfirm}
              content={t(type === "networks" ? "delete" : "confirm")}
            />
          </Modal.Actions>
        </Modal>
      </>
    )
  );
};

DeleteModal.propTypes = {
  type: PropTypes.string,
  instance: PropTypes.object,
  button: PropTypes.bool,
  icon: PropTypes.bool,
  history: PropTypes.object,
};

export default DeleteModal;
