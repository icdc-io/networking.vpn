import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import { MultiSelect } from "container/MultiSelect";
import { useTranslation } from "react-i18next";

export const MultiSelectFormField = ({ fieldInfo, form }) => {
	const { t } = useTranslation();

	return (
		<FormField
			key={fieldInfo.name}
			control={form.control}
			name={fieldInfo.name}
			rules={fieldInfo.rules}
			render={({ field }) => {
				const { error } = form.getFieldState(fieldInfo.name);
				return (
					<FormItem className={fieldInfo.className}>
						<FormLabel>
							<b>{t(fieldInfo.label)}</b>
						</FormLabel>
						<FormControl>
							<MultiSelect
								options={fieldInfo.options || []}
								selected={field.value}
								onChange={field.onChange}
								placeholder={fieldInfo.placeholder}
								emptyText="empty"
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
