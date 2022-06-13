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
    maxLength10,
} from '../utilities/Validations';
import { CustomAccordion } from '../general/customAccordion';
import { useSelector } from 'react-redux';
import './vpnDetails.scss'
import CustomChipInput from '../general/customChipInput';
import CustomDroopdown from '../general/customDropdown';

const GeneralInput = React.lazy(() => import('container/GeneralInput'));

const VpnForm = ({ t, handleClose, handleSubmit, pristine, invalid, edit, pencil, privateKey, configs, fieldNames, managementName, initialValues }) => {

    const urlQR = useSelector(state => state.VpnStore.vpnClientConnectionDevicesQRcode);
    const user = useSelector(state => state.host.user);
    const configStatus = useSelector(state => state.VpnStore.vpnClientConnectionDevicesConfigStatus);
    const configuration = useSelector(state => state.VpnStore.vpnClientConnectionDevicesConfig);
    const [selectedConfig, setSelectedConfig] = useState(0);

    const buttonContent = edit ? t('save') : privateKey ? t('proceed') : t('add');

    const placeholderMessages = {
        clientConnections: {
            name: 'enterName',
            ip: 'enterIpWithPrefix',
            port: 'enterPort',
            mtu: 'enterMtu'
        },
        peerGateways: {
            name: 'enterName',
            peerEndpoint: 'enterPeerEndpoint',
            ip: 'enterIpWithPrefix',
            publicKey: 'enterPublicKey',
            routeSubnets: 'enterRouteSubnets'
        },
        gateway: {
            name: 'enterName',
            natSubnet: 'enterNat'
        },
        vpnDevices: {
            name: 'enterName',
            ip: 'enterIp',
            publicKey: 'enterPublicKey',
            routeSubnets: 'enterRouteSubnets',
            keepAlive: 'enterKeepAlive'
        },
        privateKey: {
            privateKey: 'enterPrivateKey'
        },
        natMapping: {
            vpn_ip: 'enterVpnIp',
            localIp: 'enterLocalIp',
            hostname: 'enterHostname'
        }
    };

    const validations = {
        clientConnections: {
            name: [name, maxLength10],
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
            vpn_ip: [ip],
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
                component={item === 'routeSubnets' ? CustomChipInput : item === 'peerEndpoint' ? CustomDroopdown : GeneralInput}
                validate={validations[managementName][item]}
                props={initialValues && edit && { initial: initialValues[item] }}
                placeholder={t(placeholderMessages[managementName][item])}
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
            {(configs && configStatus == 'fulfilled') && <>
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
