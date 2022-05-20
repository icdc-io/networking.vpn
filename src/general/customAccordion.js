import React from "react";
import { useSelector } from "react-redux";
import './customAccordion.scss';
import { Button, Icon } from "semantic-ui-react";
import DangerousHTML from 'react-dangerous-html';

export const CustomAccordion = ({t, configData, index, open, handleClick}) => {
    const connectionName = useSelector(state => state.VpnStore.vpnClientConnection.name);

    const CodeSnippet = React.lazy(() => import('container/CodeSnippet'));

    const file = new Blob([configData.config], {type: 'text/plain'});
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
                <span>{t(configData.title)}</span>
                <span>{open ? t('hide') : t('show')}</span>
            </section>
            {open && <section className='description-config'>
                <label>{t('instruction')}</label>
                {configData.title === 'qrCodeTitle' 
                    ? <div className="qr-wrapper">
                            {configData.descriptions.map((el, i) => i === 0 ? <div className="inctruction-item" key={i}>{<DangerousHTML html={t(el.text)} />}</div> : <div className="inctruction-item" key={i}>{t(el.text)}</div>)}
                        <img src={configData.urlQR} alt="img" /> </div>
                    : <div className="os-wrapper">
                        <div className="inctruction-item">{<DangerousHTML html={t(configData.descriptions[0].text, {name: connectionName})} />}</div>
                        {configData.title === 'windowsTitle' && <span>{<DangerousHTML html={t(configData.descriptions[1].text, {name: connectionName})} />}</span>}
                        <div className="api-dialog-snippet-wrapper">
                            <CodeSnippet title={t('configFile')}
                                content={configData.config}
                                copyFuncion={copy}/>
                        </div>
                          
                            {<div className="inctruction-item">{t(configData.descriptions[configData.title === 'windowsTitle'? 2 : 1].text)}</div>}
                            {configData.title === 'linuxTitle' && <div className="command"><code>{`sudo nmcli conn import type wireguard file vpn-${connectionName}.conf`}</code></div>}
                            <div className="inctruction-item">{t(configData.descriptions[configData.title === 'windowsTitle'? 3 : 2].text)}</div>
                            {configData.title === 'linuxTitle' && <div className="command"><code>{`nmcli conn show vpn-${connectionName}.conf`}</code></div>}
                        <div style={{position: 'relative'}}>
                            <div style={{width: '144px'}}><a href={link} download={`vpn-${connectionName}.conf`} className='downloadLink'><div className="linkDiv"></div></a></div>
                            <Button icon labelPosition='right' style={{marginTop: '15px'}}>
                                {t('download')}
                                <Icon name='download' />
                            </Button>
                        </div>
                        
                    </div>
                }
            </section>}
        </div>
    );
};
