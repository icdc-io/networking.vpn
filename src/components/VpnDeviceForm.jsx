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
	createVpnClientConnectionDeviceAndFetch,
	updateVpnClientConnectionDeviceAndFetch,
} from "../AppActions";
import {
	ipPattern,
	ipWithSubnetPrefixPattern,
	publicKeyPattern,
} from "../utilities/Validations";
import { InputFormField } from "./InputFormField";
import { MultiSelectInputFormField } from "./MultiSelectInputFormField";

const fieldTypes = {
	input: InputFormField,
	multiselect: MultiSelectInputFormField,
};

const fieldsInfo = [
	{
		name: "name",
		placeholder: "enterName",
		label: "name",
		type: fieldTypes.input,
		rules: {
			required: "required",
			pattern: {
				value: /^[a-zA-Z0-9_.-\s]*$/,
				message: "nameWithSpace",
			},
		},
	},
	{
		name: "ip",
		label: "ip",
		placeholder: "enterIp",
		type: fieldTypes.input,
		rules: {
			required: "required",
			pattern: {
				value: ipPattern,
				message: "ipValidation",
			},
		},
	},
	{
		name: "public_key",
		label: "publicKey",
		placeholder: "enterPublicKey",
		type: fieldTypes.input,
		rules: {
			required: "required",
			pattern: {
				value: publicKeyPattern,
				message: "ipValidation",
			},
		},
	},
	{
		name: "subnets",
		label: "routeSubnets",
		description: "enterRouteSubnets",
		type: fieldTypes.multiselect,
		rules: {
			pattern: {
				value: ipWithSubnetPrefixPattern,
				message: "ipWithSubnetPrefix",
			},
		},
	},
	{
		name: "keepalived",
		label: "keepAlive",
		placeholder: "enterKeepAlive",
		editUnavailable: true,
		type: fieldTypes.input,
		rules: {
			pattern: {
				value: /^\d+$/,
				message: "numberValidation",
			},
		},
	},
];

const VpnDeviceForm = ({ initialValues, onCancel }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { id, connectionId } = useParams();
	const next_ip = useSelector(
		(state) => state.VpnStore.vpnClientConnectionsNextIp.next_ip,
	);
	const userEmail = useSelector((state) => state.host.email);
	const isEdit = !!initialValues;

	const form = useForm({
		defaultValues: fieldsInfo.reduce(
			(acc, curr) => {
				if (!acc[curr.name]) acc[curr.name] = "";
				return acc;
			},
			{
				ip: next_ip,
				owner: userEmail,
				enabled: true,
				subnets_temp: [],
			},
		),
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (initialValues) {
			form.reset({
				name: initialValues.name,
				ip: initialValues.ip,
				public_key: initialValues.publicKey,
				subnets: "",
				keepalived: initialValues.keepAlive || "",
				owner: initialValues.owner,
				enabled: initialValues.enabled,
				subnets_temp:
					initialValues.routeSubnets?.split(",").filter((value) => value) || [],
			});
		}
	}, [initialValues]);

	const onSubmit = (formValues) => {
		const { subnets_temp, keepalived, ...values } = formValues;
		const payload = {
			...values,
			keepalived: +keepalived,
			subnets: subnets_temp.join(","),
		};
		dispatch(
			isEdit
				? updateVpnClientConnectionDeviceAndFetch(
						initialValues.id,
						connectionId,
						payload,
					)
				: createVpnClientConnectionDeviceAndFetch(connectionId, payload),
		)
			.then(onCancel)
			.catch((e) => console.log(e));
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>
					{t(initialValues ? "editDevice" : "addDevice")}
				</DialogTitle>
			</DialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={"flex flex-col gap-4"}
				>
					{fieldsInfo.map((fieldInfo) => {
						if (fieldInfo.editUnavailable && isEdit) return null;
						const FormComponent = fieldInfo.type;

						return (
							<FormComponent
								key={fieldInfo.name}
								fieldInfo={fieldInfo}
								form={form}
							/>
						);
					})}
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="secondary" onClick={onCancel}>
								{t("cancel")}
							</Button>
						</DialogClose>
						<Button type="submit">{t(initialValues ? "save" : "add")}</Button>
					</DialogFooter>
				</form>
			</Form>
		</>
	);
};

export default VpnDeviceForm;
