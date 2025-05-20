import { Button } from "container/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

const GeneralModal = (
	{ title, onSubmit, children, isDelete, className },
	ref,
) => {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [instance, setInstance] = useState();

	useImperativeHandle(ref, () => ({
		handleClick: (instance) => {
			setInstance(instance || null);
			setOpen(true);
		},
	}));

	if (instance === undefined) return null;

	const onCancel = () => setOpen(false);

	const handleSubmit = () => {
		onSubmit(instance).then(onCancel);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				aria-describedby={undefined}
				className={`networking_vpn_modal ${className || ""}`}
			>
				{title && (
					<DialogHeader>
						<DialogTitle>{t(title)}</DialogTitle>
					</DialogHeader>
				)}

				{children?.(instance, onCancel)}

				{onSubmit && (
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="secondary" onClick={onCancel}>
								{t("cancel")}
							</Button>
						</DialogClose>
						<Button
							onClick={handleSubmit}
							variant={isDelete ? "warning" : "primary"}
						>
							{t(isDelete ? "confirm" : "addNewCard")}
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default forwardRef(GeneralModal);
