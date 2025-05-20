import { Checkbox } from "container/Checkbox";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import Popup from "container/Popup";
import { CircleHelp } from "lucide-react";
import { useTranslation } from "react-i18next";

export const CheckboxFormField = ({ fieldInfo, form }) => {
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
					<FormItem>
						<div className="flex gap-2 items-center">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel className="flex items-center">
								<b>{t(fieldInfo.label)}</b>&nbsp;
								{fieldInfo.clarification && (
									<Popup content={t(fieldInfo.clarification)}>
										<span type="button">
											<CircleHelp size={16} />
										</span>
									</Popup>
								)}
							</FormLabel>
						</div>

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
