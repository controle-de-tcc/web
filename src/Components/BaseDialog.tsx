import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
} from "@mui/material";

type BaseDialogProps = {
	open: boolean;
	onCancel(): void;
	onConfirm(): void;
	text: string;
	cancelText?: string;
	confirmText?: string;
};

export const BaseDialog = ({
	open,
	onCancel,
	onConfirm,
	text,
	cancelText = "Cancelar",
	confirmText = "Descartar",
}: BaseDialogProps) => {
	return (
		<Dialog open={open} onClose={onCancel}>
			<DialogContent>
				<DialogContentText>{text}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel}>{cancelText}</Button>
				<Button onClick={onConfirm} color="error">
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
