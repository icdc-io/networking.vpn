/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Icon, Modal, Popup } from 'semantic-ui-react';
import VpnForm from './vpnForm';
import { formatVpnGatewaysData, formatClientConnectionData, formatDevicesData } from './tools';
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
    editVpnGatewayAndFetch,
    createQRcodeAndFetch
} from '../AppActions';
import './vpnDetails.scss'
const ipaddr = require('ipaddr.js');

const VpnModal = ({ t, edit, pencil, privateKey, data: values, formFields, addContentMessage, editContentMessage, managementName, natSubnet }) => {
    const { id, connectionId } = useParams();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const userEmail = JSON.parse(localStorage.getItem('user')).email;
    const [openConfigs, setOpenConfigs] = useState(false);
    const gateway = useSelector(state => formatVpnGatewaysData(state.VpnStore.gateway));
    const urlQRstatus = useSelector(state => state.VpnStore.vpnClientConnectionDevicesQRcodeStatus);
    const configStatus = useSelector(state => state.VpnStore.vpnClientConnectionDevicesConfigStatus);
    const natSubnetValue = useSelector(state => state.VpnStore.gateway.nat_subnet);
    const vpnClientConnectionData = useSelector(state => formatClientConnectionData(state.VpnStore.vpnClientConnection));
    const vpnClientConnectionDevicesData = useSelector(state => formatDevicesData(state.VpnStore.vpnClientConnectionDevices));
    const vpnNatMapping = useSelector(state => state.VpnStore.vpnNatMapping);
    const next_ip = useSelector(state => state.VpnStore.vpnClientConnectionsNextIp.next_ip);

    const addr = gateway.natSubnet && ipaddr.parse(gateway.natSubnet.split('/')[0]);
    const addrDevice = vpnClientConnectionData.subnet && ipaddr.parse(vpnClientConnectionData.subnet.split('/')[0]);
    const user = useSelector(state => state.host.user);

    const handleClose = () => { 
        setOpen(false); 
        openConfigs && setOpenConfigs(false) 
    };

    const getMapOption = (ip) => ip.kind() === 'ipv4' ? { splitter: '.', number: ip.octets.length - 1, key: 'octets' } :
        { splitter: ':', number: ip.parts.length - 1, key: 'parts' };

    const convertToBinary = (ip) => {
        const ipAddrBinary = ip.split('.').map(el => +el).map(e => e.toString(2))
        .map(el => {
            let temp = [];
                for(let i = 0; i < 8 - el.length; i ++) {
                    temp.push(0)
                }
            return temp.join('') + el
        } )
        let binaryValue = ipAddrBinary.join('');
        return parseInt(binaryValue, 2)
    };

    const convertFromBinary = (bit) => {
        const binaryValue = bit.toString(2).split('')
        while(binaryValue.length < 32) {
            binaryValue.unshift('0')
        }
        const divideBits = binaryValue.join('').match(/.{1,8}/g);
        const result = divideBits.map(el => parseInt(el, 2))
        return result.join('.')
    };

    const getIp = (currentIp, vpnData, fieldKey, ip) => {
        if (!currentIp) return undefined;
        const { number, key, splitter } = getMapOption(currentIp);

        const unavailableSubnets = vpnData?.map(item => ipaddr.parse(item[fieldKey])[key][number]).concat([currentIp.octets[3], 0, 255]);
        let flag = false;

        if(currentIp.kind() !== 'ipv4') {
            while (!flag) {
                let randomIpv6 = Math.floor(Math.random() * 65535).toString(16);
                if (!unavailableSubnets.includes(randomIpv6)) {
                    let splitIp = ip.split(splitter);
                    flag = true;
                    return { [fieldKey]: `${splitIp.slice(0, splitIp.length - 1).join(splitter)}${splitter}${nextIp}` };
                }
            }
        } else {
            const initIpAddr = currentIp.octets.map((el,i) => i == 3 ? 0 : el).join('.')
            let binaryIp = convertToBinary(initIpAddr);
            const mask = ip.split('/')[1];
            const defaultMask = convertToBinary('255.255.255.255');
            const ipMask = ipaddr.IPv4.subnetMaskFromPrefixLength(mask).octets.join('.');
            const binaryMask = convertToBinary(ipMask);
            const diapason = defaultMask - binaryMask;

            for(let i = binaryIp; i <= binaryIp + diapason; i++) {
                const fromBinaryIp = convertFromBinary(i);
                const lastOctet = fromBinaryIp.split('.')[3];
                if(unavailableSubnets.includes(+lastOctet)) {
                    binaryIp++
                } else {
                    return {[fieldKey]: fromBinaryIp}
                }
            }
        }
    };

    const nextIp = managementName === 'vpnDevices' ? {ip: next_ip} : getIp(addr, vpnNatMapping, 'vpn_ip', natSubnetValue);

    const managementMessages = {
        clientConnections: 'creatingClientConnection',
        peerGateways: 'creatingPeerGateway',
        vpnDevices: 'creatingDevice',
        privateKey: 'creatingConfig',
        natMapping: 'creatingNatMapping'
    };

    useEffect(() => {
        (urlQRstatus == 'fulfilled' && configStatus == 'fulfilled' && openConfigs) && setOpen(true)
    }, [openConfigs, urlQRstatus, configStatus]);

    const prepPayloadForSubmitingAndSubmitFunction = (id, formValues) => {
        let payload = {};
        /* eslint-disable */
        switch (managementName) {
            case 'clientConnections':
                payload = {
                    name: formValues.name,
                    ip: formValues.ip,
                    subnet: formValues.deviceSubnet,
                    gateway_ip: formValues.gateway_ip,
                    port: parseInt(formValues.port),
                    mtu: parseInt(formValues.mtu)
                };

                return edit ? updateVpnClientConnectionAndFetch(id, formValues.id, payload) : createVpnClientConnectionAndFetch(id, payload);
            case 'peerGateways':
                payload = {
                    name: formValues.name,
                    endpoint: formValues.peerEndpoint,
                    subnet: formValues.deviceSubnet,
                    gateway_ip: formValues.gateway_ip,
                    public_key: formValues.publicKey,
                    subnets: formValues.routeSubnets.join(',')
                };

                return edit ? updateVpnPeerGatewayAndFetch(id, formValues.id, payload) : createVpnPeerGatewayAndFetch(id, payload);
            case 'natMapping':
                payload = {
                    vpn_ip: formValues.vpn_ip,
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
                    keepalived: formValues.keepAlive || 0,
                    enabled: true,
                    subnets: formValues.routeSubnets.join(','),
                    owner: edit ? values.owner : userEmail
                }
                return edit ? updateVpnClientConnectionDeviceAndFetch(formValues.id, connectionId, payload) :
                    createVpnClientConnectionDeviceAndFetch(connectionId, payload)
            case 'privateKey':
                payload = {
                    private_key: formValues.privateKey,
                }
                return createQRcodeAndFetch(id, payload);
        }
        /* eslint-enable */
    };

    const onSubmit = values => {
        let messageText = managementMessages[managementName];
        messageText == 'creatingConfig' && setOpenConfigs(true)
        !edit && infoNotification(t([messageText]));
        dispatch(prepPayloadForSubmitingAndSubmitFunction(messageText === 'creatingConfig' ? values.id : id, values));
        handleClose();
    };

    const button = (edit && !pencil) ?
        <Dropdown.Item text={t('edit')} onClick={() => setOpen(true)} />
        : (pencil && edit)
            ? <Icon name="pencil alternate" className='pencil' onClick={() => setOpen(true)} />
            : privateKey ? <Dropdown.Item text={t('configs')} onClick={() => setOpen(true)} />
                : (!natSubnet && managementName == 'natMapping')
                    ? <Popup
                        on='hover'
                        pinned
                        trigger={<Button color='blue' size='small' className='disabled-btn' >
                            {t(addContentMessage)}<Icon name='question circle outline' size='large' className='info-icon' />
                        </Button>}
                        inverted
                        className='vpn'
                        position='top right'
                    >{t('natPopup')}</Popup>
                    : <Button color='blue' size='small' onClick={() => setOpen(true)}> {t(addContentMessage)} </Button>;

    return (
        (user.role === 'admin' || user.role === 'owner' || managementName == 'vpnDevices' || managementName == 'privateKey') && <>
            {button}
            <Modal
                size='tiny'
                open={open}
                onClose={handleClose}
                closeIcon
            >
                <Modal.Header content={openConfigs ? t('configs') : t(editContentMessage || addContentMessage)} />
                <Modal.Content style={{ paddingTop: '0' }}>
                    {openConfigs ? <VpnForm
                        t={t}
                        handleClose={handleClose}
                        onSubmit={onSubmit}
                        initialValues={(edit || privateKey) && values}
                        fieldNames={formFields}
                        configs
                        managementName={managementName}
                    /> :
                        <VpnForm
                            t={t}
                            handleClose={handleClose}
                            onSubmit={onSubmit}
                            initialValues={(edit || privateKey) ? values
                                : nextIp}
                            fieldNames={formFields}
                            edit={edit}
                            pencil={pencil}
                            privateKey={privateKey}
                            managementName={managementName}
                        />}
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
