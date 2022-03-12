import React from 'react';
import { injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { Button, Form, Modal } from 'semantic-ui-react';
import GeneralInput from '../general/generalInput';
import PropTypes from 'prop-types';
import messages from '../Messages';
import {
    hostname,
    ip,
    ipWithSubnetPrefix,
    maxLength30,
    maxLength4,
    maxLength63,
    mtu,
    name,
    number,
    peerEndpoint,
    port,
    publicKey,
    required
} from '../utilities/Validations';
import ChipInput from '../general/chipInput';

const VpnForm = ({ intl, handleClose, handleSubmit, pristine, invalid, edit, fieldNames, managementName, initialValues }) => {
    const buttonContent = edit ? intl.formatMessage(messages.save) : intl.formatMessage(messages.add);

    const validations = {
        clientConnections: {
            name: [name, maxLength30],
            ip: [ipWithSubnetPrefix],
            port: [port, maxLength4],
            mtu: [mtu, maxLength4]
        },
        peerGateways: {
            name: [name, maxLength30],
            ip: [ipWithSubnetPrefix],
            peerEndpoint: [peerEndpoint],
            publicKey: [publicKey],
            routeSubnets: []
        },
        natMapping: {
            hostname: [hostname, maxLength63],
            vpnIp: [ip],
            localIp: [ip]
        },
        gateway: {
            name: [name, maxLength30],
            natSubnet: [ipWithSubnetPrefix]
        },
        vpnDevices: {
            name: [name],
            ip: [ip],
            publicKey: [publicKey],
            routeSubnets: [],
            keepAlive: [number]
        }
    };

    const displayFields = fieldNames.map((item, key) => {
        return (
            <Field
                type={item === 'routeSubnets' && 'select-multiple'}
                key={key}
                name={item}
                label={item === 'ip' && managementName !== 'vpnDevices' ?
                    intl.formatMessage(messages.ipWithSubnetPrefix) : intl.formatMessage(messages[item])}
                component={item === 'routeSubnets' ? ChipInput : GeneralInput}
                validate={[required, ...validations[managementName][item]]}
                props={initialValues && edit && { initial: initialValues[item] }}
            />
        );
    });

    return (
        <Form>
            {displayFields}
            <Modal.Actions align='right' style={{ marginTop: 20 }}>
                <Button onClick={handleClose} content={intl.formatMessage(messages.cancel)} />
                <Button
                    primary
                    type='submit'
                    content={buttonContent}
                    disabled={pristine || invalid}
                    onClick={handleSubmit}
                />
            </Modal.Actions>
        </Form>
    );
};

VpnForm.propTypes = {
    intl: PropTypes.any,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    invalid: PropTypes.any,
    pristine: PropTypes.any,
    edit: PropTypes.any,
    fieldNames: PropTypes.array,
    managementName: PropTypes.string,
    initialValues: PropTypes.object
};

export default reduxForm({
    form: 'createVpn'
})(injectIntl(VpnForm));
