import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import { Input } from "container/Input";
import { useTranslation } from "react-i18next";

export const InputFormField = ({ fieldInfo, form }) => {
	const { t } = useTranslation();

	const rules = fieldInfo.rules || {};

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
							<b>
								{t(fieldInfo.label || fieldInfo.name)}{" "}
								{/* {rules?.required ? null : `(${t("optional")})`} */}
							</b>
						</FormLabel>
						<FormControl>
							<Input
								placeholder={t(fieldInfo.placeholder)}
								{...field}
								value={String(field.value)}
								disabled={fieldInfo.disabled}
								maxLength={rules.maxLength}
								minLength={rules.minLength}
							/>
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
