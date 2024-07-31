import React, { useEffect, useRef, useState } from "react";
import { Form, Label } from "semantic-ui-react";
import PropTypes from "prop-types";
import "./customChipInput.scss";
import { ipWithSubnetPrefix } from "../utilities/Validations";
import { useSelector } from "react-redux";

const CustomChipInput = ({
  customInitialValue,
  input,
  meta,
  label,
  placeholder,
}) => {
  const generalInitial = customInitialValue
    ? customInitialValue.split(",")
    : [];
  const [currentValues, setCurrentValues] = useState(generalInitial);
  const [value, setValue] = useState("");
  const [localError, setLocalError] = useState("");
  const user = useSelector((state) => state.host.user);

  const isAdminOrOwner = user.role === "admin" || user.role === "owner";

  const ref = useRef("");

  useEffect(() => {
    input.onChange(currentValues);
  }, [currentValues]);

  const onChange = (e) => {
    const currentValue = e.currentTarget.value;
    const isDivider =
      currentValue[currentValue.length - 1] == "," ||
      currentValue[currentValue.length - 1] == ";";

    if (isDivider) {
      setValue(currentValue.trim().slice(0, -1));
    } else {
      setValue(currentValue.trim());
    }
    if (value.length) {
      const newError = ipWithSubnetPrefix(currentValue);
      setLocalError(newError);
    }
    if (isDivider && value.trim().length && !localError) {
      setCurrentValues((prev) => [...prev, value]);
      setValue("");
      setLocalError("");
    }
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

  const isError = (meta.touched && meta.error) || localError;

  return (
    <Form.Field
      error={isError}
      disabled={meta.readOnly}
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
          placeholder={
            currentValues.length == 0 && isAdminOrOwner ? placeholder : ""
          }
          type="text"
          value={value}
          disabled={!isAdminOrOwner}
          onChange={onChange}
          onKeyDown={keyDown}
          onBlur={onBlur}
          className={currentValues.length == 0 ? "full-width" : ""}
        />
      </div>
      {isError && (
        <div>
          <Label pointing color="red" prompt>
            {localError || meta.error}
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
  placeholder: PropTypes.string,
  customInitialValue: PropTypes.object,
};

export default CustomChipInput;
