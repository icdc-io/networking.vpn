import React from "react";
import { Button, Icon } from "semantic-ui-react";

import './customAccordion.scss';

export const CustomAccordion = ({t, title, qr, urlQR, index, open, handleClick}) => {

const description = 'Pellentesque in ipsum id orci porta dapibus. Sed porttitor lectus nibh. Nulla porttitor accumsan tincidunt. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.'

    return (
        <div className="accordion" >
            <section style={open ? { borderRadius: '5px 5px 0px 0px', borderColor: '#2185D0' } : {}} className='title-config' onClick={() => handleClick(index)} >
                <span>{title}</span>
                <span>{open ? t('hide') : t('show')}</span>
            </section>
            {open && <section className='description-config'>
                {qr 
                ? <img src={urlQR} alt="img" /> 
                : <div>
                    <label>{t('instruction')}</label>
                    <ol>
                        <li> {description}</li>
                        <li> {description}</li>
                        <li> {description}</li>
                    </ol>
                    <Button icon labelPosition='right'>
                        {t('download')}
                        <Icon name='download' />
                    </Button>
                    </div>}
            </section>}
        </div>
    );
};
