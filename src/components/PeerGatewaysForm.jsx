import { Button } from "container/Button";
import { Form, useForm } from "container/Form";
import {
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
	createVpnPeerGatewayAndFetch,
	updateVpnPeerGatewayAndFetch,
} from "../AppActions";
import {
	ipPattern,
	ipWithSubnetPrefixPattern,
	namePattern,
	peerEndpoint,
	publicKeyPattern,
} from "../utilities/Validations";
import { ComboboxFormField } from "./ComboboxFormField";
import { InputFormField } from "./InputFormField";
import { MultiSelectInputFormField } from "./MultiSelectInputFormField";
import { PeerGatewaySearch } from "./PeerGatewaySearch";

const fieldTypes = {
	input: InputFormField,
	combobox: ComboboxFormField,
	multiselect: MultiSelectInputFormField,
	peerGatewaySearch: PeerGatewaySearch,
};
const fieldsInfo = [
	{
		name: "name",
		placeholder: "enterName",
		label: "name",
		type: fieldTypes.input,
		rules: {
			required: "required",
			maxLength: 10,
			pattern: {
				value: namePattern,
				message: "nameWithSpace",
			},
		},
	},
	{
		name: "subnet",
		placeholder: "enterIpWithPrefix",
		label: "deviceSubnet",
		type: fieldTypes.input,
		rules: {
			required: "required",
			pattern: {
				value: ipWithSubnetPrefixPattern,
				message: "ipWithSubnetPrefix",
			},
		},
	},
	{
		name: "gateway_ip",
		placeholder: "enterIp",
		type: fieldTypes.input,
		label: "gateway_ip",
		rules: {
			required: "required",
			pattern: {
				value: ipPattern,
				message: "ipValidation",
			},
		},
	},
	{
		name: "endpoint",
		placeholder: "enterPeerEndpoint",
		label: "peerEndpoint",
		type: fieldTypes.peerGatewaySearch,
		rules: {
			// required: "required",
			validate: peerEndpoint,
		},
	},
	{
		name: "public_key",
		placeholder: "enterPublicKey",
		type: fieldTypes.input,
		label: "publicKey",
		rules: {
			required: "required",
			pattern: {
				value: publicKeyPattern,
				message: "publicKeyValidation",
			},
		},
	},
	{
		name: "subnets",
		description: "enterRouteSubnets",
		type: fieldTypes.multiselect,
		label: "routeSubnets",
		rules: {
			pattern: {
				value: ipWithSubnetPrefixPattern,
				message: "ipWithSubnetPrefix",
			},
		},
	},
];

const returnBaseUrlForRemote = (baseUrl) => {
	return baseUrl ? baseUrl.substr(baseUrl.indexOf(".") + 1) : "";
};

const PeerGatewaysForm = ({ initialValues, onCancel }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { id } = useParams();
	const userInfo = useSelector((state) => state.host.userInfo);
	const user = useSelector((state) => state.host.user);
	const baseUrls = useSelector((state) => state.host.baseUrls);
	const isEdit = !!initialValues;

	const form = useForm({
		defaultValues: fieldsInfo.reduce(
			(acc, curr) => {
				if (!acc[curr.name]) acc[curr.name] = "";
				return acc;
			},
			{
				subnets_temp: [],
			},
		),
	});

	const optionsData = (userInfo.external.accounts[user.account].locations || [])
		.filter((location) => location !== user.location)
		.map((el) => ({
			text: `${user.account}.vpn.${returnBaseUrlForRemote(baseUrls[el])}:2200`,
			value: `${user.account}.vpn.${returnBaseUrlForRemote(baseUrls[el])}:2200`,
		}));

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (initialValues) {
			form.reset({
				...initialValues,
				subnets: "",
				subnets_temp:
					initialValues.subnets?.split(",").filter((value) => value) || [],
			});
		}
	}, [initialValues]);

	const onSubmit = (values) => {
		const { subnets_temp, endpoint, gateway_ip, name, public_key, subnet } =
			values;
		const payload = {
			gateway_ip,
			name,
			public_key,
			subnet,
			subnets: subnets_temp.join(","),
		};
		if (endpoint) payload.endpoint = endpoint;
		dispatch(
			isEdit
				? updateVpnPeerGatewayAndFetch(id, initialValues.id, payload)
				: createVpnPeerGatewayAndFetch(id, payload),
		).then(onCancel);
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>
					{t(isEdit ? "editPeerGateway" : "addPeerGateway")}
				</DialogTitle>
			</DialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={"flex flex-col gap-4"}
				>
					{fieldsInfo.map((fieldInfo) => {
						const FormComponent = fieldInfo.type;
						return (
							<FormComponent
								key={fieldInfo.name}
								fieldInfo={{
									...fieldInfo,
									options:
										fieldInfo.name === "endpoint"
											? [
													...optionsData,
													...(initialValues?.endpoint
														? [
																{
																	text: initialValues.endpoint,
																	value: initialValues.endpoint,
																},
															]
														: []),
												]
											: undefined,
								}}
								form={form}
							/>
						);
					})}
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="secondary" type="button" onClick={onCancel}>
								{t("cancel")}
							</Button>
						</DialogClose>
						<Button type="submit">{t("save")}</Button>
					</DialogFooter>
				</form>
			</Form>
		</>
	);
};

export default PeerGatewaysForm;
