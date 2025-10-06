import ipRegex from "ip-regex";
import { useState } from "react";
import { useSelector } from "react-redux";
import { hostname, port } from "../utilities/Validations";
import { ComboboxFormField } from "./ComboboxFormField";
import { returnBaseUrlForRemote } from "./PeerGatewaysForm";

export const isPeerEndpointValid = (value) => {
	if (value.includes(":")) {
		const splitValues = value.split(":");
		const leftValue = splitValues.slice(0, -1)[0];
		const rightValue = splitValues[splitValues.length - 1];

		if (value.match(/\[(.*?)\]/) && value.match(/\[(.*?)\]/)[1] !== "") {
			const ipv6Value = value.match(/\[(.*?)\]/)[1];
			return ipRegex.v6({ exact: true }).test(ipv6Value) && !port(rightValue);
		}

		return !hostname(leftValue) && !port(rightValue);
	}

	return false;
};

export const PeerGatewaySearch = ({ fieldInfo, form }) => {
	const userInfo = useSelector((state) => state.host.userInfo);
	const user = useSelector((state) => state.host.user);
	const baseUrls = useSelector((state) => state.host.baseUrls);

	const optionsData = userInfo.external.accounts[user.account].locations
		.filter((location) => location !== user.location)
		.map(
			(el) =>
				`${user.account}.vpn.${returnBaseUrlForRemote(baseUrls[el])}:2200`,
		);
	const [uniqueOptions, setUniqueOptions] = useState(optionsData);

	const onQueryChange = (search) => {
		if (!isPeerEndpointValid(search)) return;
		const value = form.getValues("endpoint");
		setUniqueOptions([search, value, ...optionsData]);
	};

	const options = [...new Set(uniqueOptions)]
		.filter((item) => item)
		.map((item) => ({
			text: item,
			value: item,
		}));

	const onChange = (value) => {
		setUniqueOptions((prevState) => [value, ...prevState]);
	};

	return (
		<ComboboxFormField
			fieldInfo={{ ...fieldInfo, options, onQueryChange, onChange }}
			form={form}
		/>
	);
};
