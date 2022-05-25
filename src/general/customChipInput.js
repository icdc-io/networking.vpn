import React, {  useEffect, useRef, useState } from "react";
import { Form, Label } from "semantic-ui-react";
import PropTypes from "prop-types";
import "./customChipInput.scss";
import { ipWithSubnetPrefix } from "../utilities/Validations";
import { useDispatch } from "react-redux";

const CustomChipInput = ({
    input,
    label,
    meta: { error, touched },
    readOnly,
    placeholder,
    initial,
}) => {
    const dispatch = useDispatch();

    const generalInitial = initial ? initial.split(",") : [];
    const [currentValues, setCurrentValues] = useState(generalInitial);
    const [value, setValue] = useState("");
    const [localError, setLocalError] = useState("");

    const ref = useRef("");

    useEffect(() => {
        dispatch({
            meta: { form: 'createVpn', field: 'routeSubnets', touch: false, persistentSubmitErrors: false },
            payload: currentValues,
            type: '@@redux-form/CHANGE'
        });
    }, [currentValues]);

    const onChange = (e) => {
        if(e.currentTarget.value[e.currentTarget.value.length - 1] == ',' || e.currentTarget.value[e.currentTarget.value.length - 1] == ';') {
            setValue(e.currentTarget.value.trim().slice(0,-1));
        } else {
            setValue(e.currentTarget.value.trim());
        };
        if (value.length) {
            const newError = ipWithSubnetPrefix(e.currentTarget.value);
            setLocalError(newError);
        };
        if((e.currentTarget.value[e.currentTarget.value.length - 1] == ',' || e.currentTarget.value[e.currentTarget.value.length - 1] == ';') && value.trim().length && !localError) {
            setCurrentValues((prev) => [...prev, value]);
            setValue("");
            setLocalError("")
        };
    };
    const keyDown = (e) => {
        if (
            value.trim().length &&
            !localError &&
            (e.keyCode == 32 || e.keyCode == 13)
        ) {
            setCurrentValues((prev) => [...prev, value]);
            setValue("");
        }
    };
    const onBlur = () => {
        if (value.trim().length && !localError) {
            setCurrentValues((prev) => [...prev, value]);
            setValue("");
        }
    };

    const onDelete = (i) =>
        setCurrentValues(currentValues.filter((el, index) => index !== i));

    return (
        <Form.Field
            error={(touched && error) || localError ? true : false}
            disabled={readOnly}
            style={{ marginTop: 20 }}
        >
            <label>{label}</label>
            <div className="input-wrapper" onClick={() => ref.current.focus()}>
                {currentValues.map((el, i) => (
                    <a key={i}>
                        {el}
                        <i
                            className="delete icon custom-delete-icon"
                            onClick={() => onDelete(i)}
                        ></i>
                    </a>
                ))}
                <input
                    ref={ref}
                    {...input}
                    placeholder={currentValues.length == 0 ? placeholder : ""}
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyDown={keyDown}
                    onBlur={onBlur}
                    className={currentValues.length == 0 ? "full-width" : ""}
                />
            </div>
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

CustomChipInput.propTypes = {
    input: PropTypes.any,
    label: PropTypes.any,
    meta: PropTypes.any,
    readOnly: PropTypes.bool,
    placeholder: PropTypes.string,
    fieldValue: PropTypes.string,
};

export default CustomChipInput;
