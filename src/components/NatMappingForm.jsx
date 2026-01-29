import { Button } from "container/Button";
import { Form, useForm } from "container/Form";
import {
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import { returnBaseUrl } from "container/ReturnBaseUrl";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
	createVpnNatMappingAndFetch,
	updateVpnNatMappingAndFetch,
} from "../AppActions";
import { hostnameValidation, ipPattern } from "../utilities/Validations";
import { InputFormField } from "./InputFormField";
import { formatVpnGatewaysData } from "./tools";

const ipaddr = require("ipaddr.js");

const fieldsInfo = [
	{
		name: "vpn_ip",
		label: "vpn_ip",
		placeholder: "enterVpnIp",
		rules: {
			required: "required",
			pattern: {
				value: ipPattern,
				message: "ipValidation",
			},
		},
	},
	{
		name: "local_ip",
		label: "localIp",
		placeholder: "enterLocalIp",
		rules: {
			required: "required",
			pattern: {
				value: ipPattern,
				message: "ipValidation",
			},
		},
	},
	{
		name: "host",
		label: "hostname",
		placeholder: "enterHostname",
		rules: {
			required: "required",
			maxLength: 63,
			validate: (value) =>
				hostnameValidation(value) ? undefined : "hostnameValidation",
		},
	},
];

const getMapOption = (ip) =>
	ip.kind() === "ipv4"
		? { splitter: ".", number: ip.octets.length - 1, key: "octets" }
		: { splitter: ":", number: ip.parts.length - 1, key: "parts" };

const convertToBinary = (ip) => {
	const ipAddrBinary = ip
		.split(".")
		.map((el) => +el)
		.map((e) => e.toString(2))
		.map((el) => {
			const temp = [];
			for (let i = 0; i < 8 - el.length; i++) {
				temp.push(0);
			}
			return temp.join("") + el;
		});
	const binaryValue = ipAddrBinary.join("");
	return Number.parseInt(binaryValue, 2);
};

const convertFromBinary = (bit) => {
	const binaryValue = bit.toString(2).split("");
	while (binaryValue.length < 32) {
		binaryValue.unshift("0");
	}
	const divideBits = binaryValue.join("").match(/.{1,8}/g);
	const result = divideBits.map((el) => Number.parseInt(el, 2));
	return result.join(".");
};

const NatMappingForm = ({ initialValues, onCancel }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { id } = useParams();
	const user = useSelector((state) => state.host.user);
	const baseUrls = useSelector((state) => state.host.baseUrls);
	const gateway = useSelector((state) =>
		formatVpnGatewaysData(state.VpnStore.gateway),
	);
	const vpnNatMapping = useSelector((state) => state.VpnStore.vpnNatMapping);

	const natSubnetValue = useSelector(
		(state) => state.VpnStore.gateway.nat_subnet,
	);
	const baseHostname = returnBaseUrl(baseUrls, user.location);
	const addr =
		gateway.natSubnet && ipaddr.parse(gateway.natSubnet.split("/")[0]);
	const getIp = (currentIp, vpnData, fieldKey, ip) => {
		if (!currentIp) return undefined;
		const { number, key, splitter } = getMapOption(currentIp);

		const unavailableSubnets = vpnData
			?.map((item) => ipaddr.parse(item[fieldKey])[key][number])
			.concat([currentIp.octets[3], 0, 255]);
		let flag = false;

		if (currentIp.kind() !== "ipv4") {
			while (!flag) {
				const randomIpv6 = Math.floor(Math.random() * 65535).toString(16);
				if (!unavailableSubnets.includes(randomIpv6)) {
					const splitIp = ip.split(splitter);
					flag = true;
					return `${splitIp.slice(0, splitIp.length - 1).join(splitter)}${splitter}${nextIp}`;
				}
			}
		} else {
			const initIpAddr = currentIp.octets
				.map((el, i) => (i === 3 ? 0 : el))
				.join(".");
			let binaryIp = convertToBinary(initIpAddr);
			const mask = ip.split("/")[1];
			const defaultMask = convertToBinary("255.255.255.255");
			const ipMask =
				ipaddr.IPv4.subnetMaskFromPrefixLength(mask).octets.join(".");
			const binaryMask = convertToBinary(ipMask);
			const diapason = defaultMask - binaryMask;

			for (let i = binaryIp; i <= binaryIp + diapason; i++) {
				const fromBinaryIp = convertFromBinary(i);
				const lastOctet = fromBinaryIp.split(".")[3];
				if (unavailableSubnets.includes(+lastOctet)) {
					binaryIp++;
				} else {
					return { [fieldKey]: fromBinaryIp };
				}
			}
		}
	};

	const nextIp = getIp(addr, vpnNatMapping, "vpn_ip", natSubnetValue);

	const form = useForm({
		defaultValues: fieldsInfo.reduce((acc, curr) => {
			acc[curr.name] = nextIp[curr.name] || "";
			return acc;
		}, {}),
	});
	const isEdit = !!initialValues;

	useEffect(() => {
		if (initialValues) {
			form.reset({
				host: initialValues.host,
				local_ip: initialValues.local_ip,
				vpn_ip: initialValues.vpn_ip,
			});
		}
	}, [initialValues]);

	const onSubmit = (values) => {
		const { host, local_ip, vpn_ip } = values;
		const payload = { host, local_ip, vpn_ip };
		dispatch(
			isEdit
				? updateVpnNatMappingAndFetch(id, initialValues.id, payload)
				: createVpnNatMappingAndFetch(id, payload),
		).then(onCancel);
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>
					{t(isEdit ? "editNatMapping" : "addNatMapping")}
				</DialogTitle>
			</DialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={"flex flex-col gap-4"}
				>
					{fieldsInfo.map((fieldInfo) => {
						const input = (
							<InputFormField
								key={fieldInfo.name}
								fieldInfo={fieldInfo}
								form={form}
							/>
						);
						if (fieldInfo.name !== "host") return input;
						return (
							<div key={fieldInfo.name} className="host_input flex gap-2">
								<div className="input_container">{input}</div>
								<p className="host_value">{`.${user.account}.vpn.${baseHostname}`}</p>
							</div>
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

export default NatMappingForm;
