import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import { Input } from "container/Input";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const TEMP_POSTFIX = "_temp";

export const MultiSelectInputFormField = ({ fieldInfo, form }) => {
	const { t } = useTranslation();

	const rules = fieldInfo.rules || {};
	const tempName = fieldInfo.name + TEMP_POSTFIX;

	const items = form.watch(tempName);

	const onTrigger = (field) => {
		form.trigger(fieldInfo.name).then((isValid) => {
			if (isValid) {
				form.setValue(
					tempName,
					[...items, field.value].filter((value) => value),
				);
				field.onChange("");
			} else {
				field.onChange(field.value.trim());
			}
		});
	};

	const onChange = (field) => (e) => {
		const { value } = e.target;
		if ([" ", ","].includes(value[value.length - 1])) {
			onTrigger(field);
			return;
		}
		form.resetField(fieldInfo.name);
		field.onChange(value);
	};

	// const onKeyDown = (field) => (e) => {
	// 	if ([13, 32, 188].includes(e.keyCode)) {
	// 		field.value
	// 			? form.trigger(fieldInfo.name).then((isValid) => {
	// 					if (isValid) {
	// 						form.setValue(tempName, [...items, field.value]);
	// 						field.onChange("");
	// 					} else {
	// 						field.onChange(field.value.trim());
	// 					}
	// 				})
	// 			: form.resetField("subnets");
	// 	}
	// };

	const onBlur = (field) => () => {
		field.value && onTrigger(field);
	};

	return (
		<FormField
			key={fieldInfo.name}
			control={form.control}
			name={fieldInfo.name}
			rules={rules}
			render={({ field }) => {
				const { error } = form.getFieldState(fieldInfo.name);
				return (
					<FormItem className={fieldInfo.className}>
						<FormLabel>
							<b>{t(fieldInfo.label || fieldInfo.name)} </b>
						</FormLabel>
						<FormControl>
							{
								<div
									className={
										"multiselect_input gap-2 flex h-auto flex-wrap items-center border h-9 border-input rounded-md transition-all focus-within:ring-1 focus-within:ring-ring"
									}
									cmdk-input-wrapper=""
								>
									{items.map((el, i) => (
										<div className="subnet" key={i}>
											<span>{el}</span>
											<button
												onClick={() => {
													form.setValue(
														tempName,
														items.filter((_item, key) => key !== i),
													);
												}}
												type="button"
											>
												<X size={12} />
											</button>
										</div>
									))}

									<Input
										{...field}
										placeholder={t(fieldInfo.placeholder)}
										onChange={onChange(field)}
										// onKeyDown={onKeyDown(field)}
										onBlur={onBlur(field)}
										value={String(field.value)}
										disabled={fieldInfo.disabled}
										maxLength={rules.maxLength}
										minLength={rules.minLength}
										className="border-0 focus-visible:outline-0 focus-visible:outline-transparent focus-visible:shadow-[none] w-auto"
									/>
								</div>
							}
						</FormControl>
						{error?.message && <FormMessage>{t(error.message)}</FormMessage>}
						{fieldInfo.description && (
							<FormDescription>{t(fieldInfo.description)}</FormDescription>
						)}
					</FormItem>
				);
			}}
		/>
	);
};
