import React, { useState } from 'react';
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
    isPrivateKey,
    required,
    nameWithSpace
} from '../utilities/Validations';
import ChipInput from '../general/chipInput';
import { CustomAccordion } from '../general/customAccordion';
import { useSelector } from 'react-redux';

const GeneralInput = React.lazy(() => import('container/GeneralInput'));

const VpnForm = ({ t, handleClose, handleSubmit, pristine, invalid, edit, pencil, privateKey, configs, deviceData, fieldNames, managementName, initialValues }) => {

    const urlQR = useSelector(state => state.VpnStore.vpnClientConnectionDevicesQRcode);
    const [selectedConfig, setSelectedConfig] = useState(0);

    const buttonContent = edit ? t('save') : privateKey ? t('proceed') : t('add');

    const validations = {
        clientConnections: {
            name: [name, maxLength30],
            ip: [ipWithSubnetPrefix],
            port: [port],
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
            name: [nameWithSpace, required],
            ip: [ip, required],
            publicKey: [publicKey, required],
            routeSubnets: [],
            keepAlive: [number, required]
        },
        privateKey: {
            privateKey: [isPrivateKey]
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
                validate={validations[managementName][item]}
                props={initialValues && edit && { initial: initialValues[item] }}
            />
        );
    });


    const deviceConfigsData = [
        {title: 'QR code for mobile devices', urlQR: urlQR},
        {title: 'Windows\MAC config'},
        {title: 'Linux Network Manager connection'},

    ];
    const deviceConfigs = deviceConfigsData.map((el, index) => 
        <CustomAccordion 
            key={index} 
            index={index} 
            t={t} 
            title={el.title} 
            urlQR={el.urlQR} 
            deviceData={deviceData}
            open={selectedConfig == index} 
            handleClick={setSelectedConfig}
        />);

    return (
        <Form>
            {(pencil || privateKey || configs) && <>
                <label htmlFor="">{t('name')}</label>
                <p>{initialValues['name']}</p>
            </>}
            {!configs && displayFields}
            {privateKey && <div className='privateKeyInfo'>{t('privateKeyInfo')}</div>}
            {configs && <>
                <label htmlFor="">{t('files')}</label>
                {deviceConfigs}
            </>}
            <Modal.Actions align='right' style={{ marginTop: 20 }}>
                {!privateKey &&  <Button onClick={handleClose} content={t('cancel')} primary={configs}/>}
                {!configs && <Button
                    primary
                    type='submit'
                    content={buttonContent}
                    disabled={pristine || invalid}
                    onClick={handleSubmit}
                />}
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
