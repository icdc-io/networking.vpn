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
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
	createVpnClientConnectionAndFetch,
	updateVpnClientConnectionAndFetch,
} from "../AppActions";
import {
	ipPattern,
	ipWithSubnetPrefixPattern,
	mtu,
	namePattern,
	port,
} from "../utilities/Validations";
import { CheckboxFormField } from "./CheckboxFormField";
import { InputFormField } from "./InputFormField";

const fieldsInfo = [
	{
		name: "name",
		placeholder: "enterName",
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
		rules: {
			required: "required",
			pattern: {
				value: ipPattern,
				message: "ipValidation",
			},
		},
	},
	{
		name: "port",
		placeholder: "enterPort",
		rules: {
			required: "required",
			validate: port,
		},
	},
	{
		name: "mtu",
		placeholder: "enterMtu",
		rules: {
			maxLength: 4,
			validate: mtu,
		},
	},
];

const ClientConnectionsForm = ({ initialValues, onCancel }) => {
	const { t } = useTranslation();
	const { id } = useParams();

	const form = useForm({
		defaultValues: fieldsInfo.reduce(
			(acc, curr) => {
				if (!acc[curr.name]) acc[curr.name] = "";
				return acc;
			},
			{
				masquerade: true,
			},
		),
	});
	const dispatch = useDispatch();
	const isEdit = !!initialValues;

	const handleSubmit = (formValues) => {
		const payload = {
			name: formValues.name,
			subnet: formValues.subnet,
			gateway_ip: formValues.gateway_ip,
			port: Number.parseInt(formValues.port),
			mtu: Number.parseInt(formValues.mtu),
			masquerade: formValues.masquerade,
		};
		dispatch(
			isEdit
				? updateVpnClientConnectionAndFetch(id, initialValues.id, payload)
				: createVpnClientConnectionAndFetch(id, payload),
		).then(onCancel);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (initialValues) {
			form.reset({
				name: initialValues.name || "",
				subnet: initialValues.subnet || "",
				gateway_ip: initialValues.gateway_ip,
				port: initialValues.port?.toString() || "",
				mtu: initialValues.mtu?.toString() || "",
				masquerade: initialValues.masquerade,
			});
		}
	}, [initialValues]);

	return (
		<>
			<DialogHeader>
				<DialogTitle>
					{t(isEdit ? "editClientConnection" : "addClientConnection")}
				</DialogTitle>
			</DialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className={"flex flex-col gap-4"}
				>
					{fieldsInfo.map((fieldInfo) => (
						<InputFormField
							key={fieldInfo.name}
							fieldInfo={fieldInfo}
							form={form}
						/>
					))}
					<CheckboxFormField
						fieldInfo={{
							name: "masquerade",
							label: "enableNat",
							clarification: "enableNatTip",
						}}
						form={form}
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="secondary" type="button" onClick={onCancel}>
								{t("cancel")}
							</Button>
						</DialogClose>
						<Button type="submit" disabled={!form.formState.isDirty}>
							{t("save")}
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</>
	);
};

export default ClientConnectionsForm;
