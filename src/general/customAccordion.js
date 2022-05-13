import React, { useEffect, useState } from "react";

import './customAccordion.scss';

export const CustomAccordion = ({t, title, qr, urlQR, description}) => {

const [open, setOpen] = useState(true);

    return (
        <div className="accordion" onClick={() => setOpen(prev => !prev)}>
            <section style={open ? { borderRadius: '5px 5px 0px 0px', borderColor: '#2185D0' } : {}} className='title'>
                <span>{title}</span>
                <span>{open ? t('hide') : t('show')}</span>
            </section>
            {open && <section className='description'>
                {qr 
                ? <img src={urlQR} alt="img" /> 
                : <div>{description}</div>}
            </section>}
        </div>
    );
};
