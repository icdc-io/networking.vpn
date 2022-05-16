import React from "react";
import { useSelector } from "react-redux";
import './customAccordion.scss';
import { Button, Icon } from "semantic-ui-react";
import { getConfiguration } from "../utilities/getConfiguration";

export const CustomAccordion = ({t, title, urlQR, deviceData, index, open, handleClick}) => {
    const user = useSelector(state => state.host.user);
    const vpnStore = useSelector(state => state.VpnStore);
    const device = vpnStore.vpnClientConnectionDevices.find(e => e.id == deviceData.id);

    const CodeSnippet = React.lazy(() => import('container/CodeSnippet'));

    const initialConfigData = {
        vpnConnectName: vpnStore.vpnClientConnection.name,
        vpnConnectSubPrefix: vpnStore.vpnClientConnection.ip.slice(-2),
        vpnConnectSubnet: vpnStore.gateway.nat_subnet,
        vpnConnectPort: vpnStore.vpnClientConnection.port,
        devicePrivateKey: deviceData.privateKey,
        deviceIp: device.ip,
        deviceKeepAlive: device.keepalived,
        //dns: 'TEST',
        locationName: user.location,
        locationPublicKey: vpnStore.gateway.public_key,
        natMapSubnet: vpnStore.gateway.nat_subnet,
        vpcAllSubnets: device.subnets,
        account: user.account
    };

    const nameOfFile = `vpn-${vpnStore.vpnClientConnection.name}.conf`

    const description = 'Pellentesque in ipsum id orci porta dapibus. Sed porttitor lectus nibh. Nulla porttitor accumsan tincidunt. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.'
    const value = getConfiguration(initialConfigData);
    const file = new Blob([value], {type: 'text/plain'});
    let link =  URL.createObjectURL(file);

    const copy = value => {
        const singleLineValue = value.replaceAll('\n', '');
        navigator.clipboard.writeText(singleLineValue)
            .catch(err => {
                console.log('Something went wrong', err); // eslint-disable-line no-console
            });
    };

    return (
        <div className="accordion" >
            <section style={open ? { borderRadius: '5px 5px 0px 0px', borderColor: '#2185D0' } : {}} className='title-config' onClick={() => handleClick(index)} >
                <span>{title}</span>
                <span>{open ? t('hide') : t('show')}</span>
            </section>
            {open && <section className='description-config'>
                {urlQR 
                    ? <img src={urlQR} alt="img" /> 
                    : <div>
                        <label>{t('instruction')}</label>
                        <ol>
                            <li> {description}</li>
                        </ol>
                        <div className="api-dialog-snippet-wrapper">
                        <CodeSnippet title={t('configFile')}
                    content={value}
                    copyFuncion={copy}
                     /></div>
                        <Button icon labelPosition='right' style={{marginTop: '15px'}}>
                            <a href={link} download={nameOfFile} onClick={() => console.log('click')}>  {t('download')}</a>
                            <Icon name='download' />
                        </Button>
                    </div>
                }
            </section>}
        </div>
    );
};
