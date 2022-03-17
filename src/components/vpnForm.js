import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Form, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
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

const GeneralInput = React.lazy(() => import('container/GeneralInput'));

const VpnForm = ({ t, handleClose, handleSubmit, pristine, invalid, edit, fieldNames, managementName, initialValues }) => {
    const buttonContent = edit ? t('save') : t('add');

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
                    t('ipWithSubnetPrefix') : t([item])}
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
                <Button onClick={handleClose} content={t('cancel')} />
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
    t: PropTypes.func,
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
})(VpnForm);
