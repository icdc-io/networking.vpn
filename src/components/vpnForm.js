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
    nameWithSpace,
} from '../utilities/Validations';
import ChipInput from '../general/chipInput';
import { CustomAccordion } from '../general/customAccordion';
import { useSelector } from 'react-redux';
import './vpnDetails.scss'
import CustomChipInput from '../general/customChipInput';

const GeneralInput = React.lazy(() => import('container/GeneralInput'));

const VpnForm = ({ t, handleClose, handleSubmit, pristine, invalid, edit, pencil, privateKey, configs, fieldNames, managementName, initialValues }) => {

    const urlQR = useSelector(state => state.VpnStore.vpnClientConnectionDevicesQRcode);
    const user = useSelector(state => state.host.user);
    const configuration = useSelector(state => state.VpnStore.vpnClientConnectionDevicesConfig);
    const [selectedConfig, setSelectedConfig] = useState(0);

    const buttonContent = edit ? t('save') : privateKey ? t('proceed') : t('add');

    const placeholderMessages = {
        clientConnections: {
            name: 'Enter a name',
            ip: 'ex. 10.206.1.1/24',
            port: 'ex. 2200',
            mtu: 'ex. 1500'
        },
        peerGateways: {
            name: 'Enter a name',
            peerEndpoint: 'Enter or choose. E.g. acc.vpn.loc.icdc.io:2200',
            ip: 'e.g. 10.253.25.1/24',
            publicKey: 'Enter a public key',
            routeSubnets: 'Use space or comma to separate'
        },
        gateway: {
            name: 'Enter a name',
            natSubnet: 'Enter a NAT Subnet'
        },
        vpnDevices: {
            name: 'Enter a name',
            ip: 'e.g. 10.253.25.1',
            publicKey: 'Enter a public key',
            routeSubnets: 'Use space or comma to separate',
            keepAlive: 'Enter a number of seconds'
        },
        privateKey: {
            privateKey: 'Enter a private key'
        },
        natMapping: {
            vpnIp: 'Enter a VPN IP',
            localIp: 'Enter a local IP',
            hostname: 'Enter a hostname'
        }
    };

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
            peerEndpoint: [],
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
        return (<div className={item == 'hostname' ? 'hostname-field' : ''}>
            <Field
                type={item === 'routeSubnets' && 'select-multiple'}
                key={key}
                name={item}
                label={item === 'ip' && managementName !== 'vpnDevices' ?
                    t('ipWithSubnetPrefix') : t([item])}
                // component={item === 'routeSubnets' ? ChipInput : GeneralInput}
                component={item === 'routeSubnets' ? CustomChipInput : GeneralInput}
                validate={validations[managementName][item]}
                props={initialValues && edit && { initial: initialValues[item] }}
                placeholder={placeholderMessages[managementName][item]}
            />{item == 'hostname' && <p>{`.${user.account}.vpn.${user.location}.icdc.io`}</p>}</div>
        );
    });


    const deviceConfigsData = [
        {title: 'qrCodeTitle', descriptions: [ {text: 'descriptionQrFirst'}, {text: 'descriptionQrSecond'}, {text: 'descriptionQrThird'}], urlQR: urlQR},
        {title: 'windowsTitle', descriptions: [ {text: 'descriptionWinConfigFirst'}, {text: 'descriptionWinConfigSecond'}, {text: 'descriptionWinConfigThird'}, {text: 'descriptionWinConfigFour'} ], config: configuration},
        {title: 'linuxTitle', descriptions: [ {text: 'descriptionLinuxConfigFirst'}, {text: 'descriptionLinuxConfigSecond'}, {text: 'descriptionLinuxConfigThird'}], config: configuration},

    ];
    const deviceConfigs = deviceConfigsData.map((el, index) => 
        <CustomAccordion 
            key={index} 
            index={index} 
            t={t} 
            configData={el}
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
                {!privateKey &&  <Button onClick={handleClose} content={configs ? t('close') : t('cancel')} primary={configs}/>}
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
