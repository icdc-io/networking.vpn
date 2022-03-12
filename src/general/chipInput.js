import React, { useEffect, useState } from 'react';
import { Form, Label, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './chipInput.scss';
import { useDispatch } from 'react-redux';
import { ipWithSubnetPrefix } from '../utilities/Validations';

const ChipInput = ({ label, meta: { error, touched }, initial }) => {
    const dispatch = useDispatch();

    const generalInitial = initial ? initial.split(',') : [];

    const [options, setOptions] = useState(generalInitial.map(item => ({ text: item, value: item })));
    const [currentValues, setCurrentValues] = useState(generalInitial);
    const [localError, setLocalError] = useState('');

    const timeout = () => setTimeout(() => setLocalError(''), 2000);

    const handleAddition = (_e, { value }) => !localError && setOptions(prevState => [{ text: value, value }, ...prevState]);

    useEffect(() => {
        dispatch({
            meta: { form: 'createVpn', field: 'routeSubnets', touch: false, persistentSubmitErrors: false },
            payload: currentValues,
            type: '@@redux-form/CHANGE'
        });
    }, [currentValues]);

    const onBlur = () => dispatch({
        meta: { form: 'createVpn', field: 'routeSubnets', touch: true },
        payload: currentValues,
        type: '@@redux-form/BLUR'
    });

    const handleChange = (_e, { value }) => {
        const itemsCount = value.length;
        if (!itemsCount) {
            setCurrentValues(value);
        } else {
            const newError = ipWithSubnetPrefix(value[itemsCount - 1]);
            //TODO: This currently accepts only ipv4 format to change it so it can accept ipv6 also use peerEndpoint from validations.js
            setLocalError(newError);
            !newError ? setCurrentValues(value) : timeout();
        }
    };

    return (
        <Form.Field error={(touched && error) || localError ? true : false} style={{ marginTop: 20 }}>
            <label>{label}</label>
            <Dropdown
                options={options}
                search
                selection
                fluid
                multiple
                allowAdditions
                value={currentValues}
                onAddItem={handleAddition}
                onChange={handleChange}
                onBlur={onBlur}
                className='chip-input'
            />
            {((touched && error) || localError) && <div><Label pointing color='red' prompt>{localError || error}</Label></div>}
        </Form.Field>
    );
};

ChipInput.propTypes = {
    input: PropTypes.any,
    label: PropTypes.any,
    meta: PropTypes.any,
    readOnly: PropTypes.bool,
    placeholder: PropTypes.string,
    fieldValue: PropTypes.string,
    style: PropTypes.any,
    dnsType: PropTypes.string,
    initial: PropTypes.string
};

export default ChipInput;
