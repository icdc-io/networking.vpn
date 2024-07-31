import React, { useEffect, useState } from "react";
import { Form, Label, Dropdown } from "semantic-ui-react";
import PropTypes from "prop-types";
import "./chipInput.scss";
import { useSelector } from "react-redux";
import { peerEndpoint } from "../utilities/Validations";

const CustomDropdown = ({
  customInitialValue,
  meta,
  input,
  placeholder,
  label,
}) => {
  const user = useSelector((state) => state.host.user);
  const availableLocations = useSelector(
    (state) => state.host.fullAccountsInfo,
  );
  const baseUrls = useSelector((state) => state.host.baseUrls);

  const returnBaseUrlForRemote = (baseUrl) => {
    return baseUrl ? baseUrl.substr(baseUrl.indexOf(".") + 1) : "";
  };

  const generalInitial = customInitialValue || "";

  const optionsData = availableLocations[user.account].locations
    .filter((location) => location !== user.location)
    .map((el) => ({
      text: `${user.account}.vpn.${returnBaseUrlForRemote(baseUrls[el])}:2200`,
      value: `${user.account}.vpn.${returnBaseUrlForRemote(baseUrls[el])}:2200`,
    }));

  const [options, setOptions] = useState(optionsData);
  const [value, setValue] = useState(generalInitial);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    customInitialValue &&
      setOptions((prev) => [
        { text: customInitialValue, value: customInitialValue },
        ...prev,
      ]);
  }, [customInitialValue]);

  const handleAddition = (_e, { value }) => {
    !localError &&
      setOptions((prevState) => [{ text: value, value }, ...prevState]);
  };
  const handleChange = (_e, { value }) => {
    setLocalError(peerEndpoint(value));
    setValue(value);
    input.onChange(value);
  };

  return (
    <Form.Field
      error={(meta.touched && meta.error) || localError}
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
      {((meta.touched && meta.error) || localError) && (
        <div>
          <Label pointing color="red" prompt>
            {localError || meta.error}
          </Label>
        </div>
      )}
    </Form.Field>
  );
};

CustomDropdown.propTypes = {
  input: PropTypes.any,
  label: PropTypes.any,
  meta: PropTypes.object,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  customInitialValue: PropTypes.string,
};

export default CustomDropdown;
