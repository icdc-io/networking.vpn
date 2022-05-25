import React, { useEffect, useState } from "react";
import { Form, Label, Dropdown } from "semantic-ui-react";
import PropTypes from "prop-types";
import "./chipInput.scss";
import { useDispatch, useSelector } from "react-redux";
import { peerEndpoint } from "../utilities/Validations";

const CustomDroopdown = ({
    label,
    meta: { error, touched },
    initial,
    placeholder,
}) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.host.user);
    const locations = ["zby", "zbydev", "sbg", "xby"];

    const generalInitial = initial ? initial : "";
    const optionsData = locations.map((el) => ({
        text: `${user.account}.vpn.${el}.icdc.io:2200`,
        value: `${user.account}.vpn.${el}.icdc.io:2200`,
    }));

    const [options, setOptions] = useState(optionsData);
    const [value, setValue] = useState(generalInitial);
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        initial &&
            setOptions((prev) => [{ text: initial, value: initial }, ...prev]);
    }, [initial]);

    useEffect(() => {
        dispatch({
            meta: {
                form: "createVpn",
                field: "peerEndpoint",
                touch: false,
                persistentSubmitErrors: false,
            },
            payload: value,
            type: "@@redux-form/CHANGE",
        });
    }, [value]);

    const handleAddition = (_e, { value }) => {
        !localError && setOptions((prevState) => [{ text: value, value }, ...prevState]);
    };
    const handleChange = (_e, { value }) => {
        setLocalError(peerEndpoint(value));
        setValue(value);

    };

    return (
        <Form.Field
            error={(touched && error) || localError ? true : false}
            style={{ marginTop: 20 }}
        >
            <label>{label}</label>
            <Dropdown
                options={options}
                search
                selection
                fluid
                allowAdditions
                additionLabel=""
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onAddItem={handleAddition}
            />
            {((touched && error) || localError) && (
                <div>
                    <Label pointing color="red" prompt>
                        {localError || error}
                    </Label>
                </div>
            )}
        </Form.Field>
    );
};

CustomDroopdown.propTypes = {
    input: PropTypes.any,
    label: PropTypes.any,
    meta: PropTypes.any,
    readOnly: PropTypes.bool,
    placeholder: PropTypes.string,
    fieldValue: PropTypes.string,
    style: PropTypes.any,
    dnsType: PropTypes.string,
    initial: PropTypes.string,
};

export default CustomDroopdown;
