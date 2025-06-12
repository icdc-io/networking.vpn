import { Button } from "container/Button";
import { Form, useForm } from "container/Form";
import { Label } from "container/Label";
import Loader from "container/Loader";
import {
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createQRcodeAndFetch } from "../AppActions";
import { CustomAccordion } from "../general/customAccordion";
import { publicKeyPattern } from "../utilities/Validations";
import { InputFormField } from "./InputFormField";

const PrivateKeyForm = ({ initialValues, onCancel }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const configStatus = useSelector(
		(state) => state.VpnStore.vpnClientConnectionDevicesConfigStatus,
	);
	const configuration = useSelector(
		(state) => state.VpnStore.vpnClientConnectionDevicesConfig,
	);
	const urlQR = useSelector(
		(state) => state.VpnStore.vpnClientConnectionDevicesQRcode,
	);
	const urlQRFetchStatus = useSelector(
		(state) => state.VpnStore.vpnClientConnectionDevicesQRcodeStatus,
	);
	const [configs, setConfigs] = useState(false);
	const [selectedConfig, setSelectedConfig] = useState(0);

	const form = useForm({
		defaultValues: { private_key: "" },
	});

	const onSubmit = (values) => {
		dispatch(createQRcodeAndFetch(initialValues.id, values));
		setConfigs(true);
		// onCancel();
	};

	const deviceConfigsData = [
		{
			title: "qrCodeTitle",
			descriptions: [
				{ text: "descriptionQrFirst" },
				{ text: "descriptionQrSecond" },
				{ text: "descriptionQrThird" },
			],
			urlQR: urlQR,
		},
		{
			title: "windowsTitle",
			descriptions: [
				{ text: "descriptionWinConfigFirst" },
				{ text: "descriptionWinConfigSecond" },
				{ text: "descriptionWinConfigThird" },
				{ text: "descriptionWinConfigFour" },
			],
			config: configuration,
		},
		{
			title: "linuxTitle",
			descriptions: [
				{ text: "descriptionLinuxConfigFirst" },
				{ text: "descriptionLinuxConfigSecond" },
				{ text: "descriptionLinuxConfigThird" },
			],
			config: configuration,
		},
	];

	const deviceConfigs = deviceConfigsData.map((el, index) => (
		<CustomAccordion
			key={el.title}
			index={index}
			configData={el}
			open={selectedConfig === index}
			handleClick={setSelectedConfig}
		/>
	));

	return (
		<div className="flex flex-col gap-2">
			<DialogHeader>
				<DialogTitle>{t(configs ? "configs" : "enterPrivatekey")}</DialogTitle>
			</DialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={"flex flex-col gap-4"}
				>
					<div>
						<Label>
							<b>{t("name")}</b>
						</Label>
						<div>{initialValues.name}</div>
					</div>
					{!configs && (
						<InputFormField
							form={form}
							fieldInfo={{
								name: "private_key",
								placeholder: "enterPrivatekey",
								label: "privateKey",
								rules: {
									required: "required",
									pattern: {
										value: publicKeyPattern,
										message: "privateKeyValidation",
									},
								},
							}}
						/>
					)}
					{[configStatus, urlQRFetchStatus].includes("pending") && <Loader />}
					{["", "fulfilled"].includes(configStatus) && !configs && (
						<div className="privateKeyInfo">{t("privateKeyInfo")}</div>
					)}
					{configs && configStatus === "fulfilled" && (
						<>
							<Label>
								<b>{t("files")}</b>
							</Label>
							{deviceConfigs}
						</>
					)}
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="secondary" type="button" onClick={onCancel}>
								{t(configs ? "close" : "cancel")}
							</Button>
						</DialogClose>
						{!configs && (
							<Button type="submit" disabled={!form.formState.isDirty}>
								{t("proceed")}
							</Button>
						)}
					</DialogFooter>
				</form>
			</Form>
		</div>
	);
};

export default PrivateKeyForm;
