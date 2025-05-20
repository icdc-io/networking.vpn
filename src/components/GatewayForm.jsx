import { Button } from "container/Button";
import { Form, useForm } from "container/Form";
import { DialogClose, DialogFooter } from "container/Modal";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { editVpnGatewayAndFetch } from "../AppActions";
import {
	ipWithSubnetPrefixPattern,
	namePattern,
} from "../utilities/Validations";
import { InputFormField } from "./InputFormField";

const fieldsInfo = [
	{
		name: "name",
		label: "name",
		placeholder: "enterName",
		editDisabled: true,
		rules: {
			maxLength: 30,
			pattern: {
				value: namePattern,
				message: "nameWithSpace",
			},
		},
	},
	{
		name: "nat_subnet",
		label: "natSubnet",
		placeholder: "enterNat",
		rules: {
			// required: "required",
			pattern: {
				value: ipWithSubnetPrefixPattern,
				message: "ipWithSubnetPrefix",
			},
		},
	},
];

const GatewayForm = ({ initialValues, onCancel, edit }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const form = useForm({
		defaultValues: fieldsInfo.reduce((acc, curr) => {
			acc[curr.name] = "";
			return acc;
		}, {}),
	});

	const onSubmit = (formValues) => {
		const { id, ...payload } = formValues;
		dispatch(editVpnGatewayAndFetch(id, payload)).then(onCancel);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (initialValues) {
			form.reset({
				id: initialValues.id,
				name: initialValues.name || "",
				nat_subnet: initialValues.natSubnet || "",
			});
		}
	}, [initialValues]);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={"flex flex-col gap-4"}
			>
				{fieldsInfo.map((fieldInfo) => (
					<InputFormField
						key={fieldInfo.name}
						fieldInfo={{
							...fieldInfo,
							disabled: fieldInfo.editDisabled && edit,
						}}
						form={form}
					/>
				))}
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
	);
};

export default GatewayForm;
