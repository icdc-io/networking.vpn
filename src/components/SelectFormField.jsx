import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "container/Select";
import { useTranslation } from "react-i18next";

export const SelectFormField = ({ fieldInfo, form, isEditing }) => {
	const { t } = useTranslation();

	if (form.getValues(form.data) && !fieldInfo.options?.length) return null;

	return (
		<FormField
			key={fieldInfo.data}
			control={form.control}
			name={fieldInfo.data}
			rules={fieldInfo.rules?.(isEditing, form) || undefined}
			render={({ field }) => {
				const { error } = form.getFieldState(fieldInfo.data);
				return (
					<FormItem className={fieldInfo.className}>
						<FormLabel>
							<b>{t((isEditing && fieldInfo.editLabel) || fieldInfo.label)}</b>
						</FormLabel>
						<Select
							onValueChange={field.onChange}
							value={field.value}
							disabled={fieldInfo.disabled}
						>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder={t(fieldInfo.placeholder)} />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{fieldInfo.options?.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.text}
									</SelectItem>
								)) || []}
							</SelectContent>
						</Select>
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
