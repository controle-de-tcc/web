import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback, useMemo, useState } from "react";
import { client } from "Services";
import { useSnackbar } from "Hooks/useSnackbar";
import {
	Button,
	Container,
	Dialog,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { BaseDialog } from "./BaseDialog";

type VersionFormData = {
	file: File;
};

const formSchema = yup.object({
	file: yup.mixed().required("Selecione um arquivo"),
});

type NewVersionProps = {
	dialogOpen: boolean;
	handleDialog(value: boolean, update?: boolean): void;
	projectId: number;
};

export const NewVersion = ({
	dialogOpen,
	handleDialog,
	projectId,
}: NewVersionProps) => {
	const theme = useTheme();
	const { toggleSnackbar } = useSnackbar();

	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

	const defaultValues = useMemo(
		() => ({
			file: undefined,
		}),
		[]
	);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<VersionFormData>({
		resolver: yupResolver(formSchema),
		defaultValues,
	});

	const onSubmit = useCallback<SubmitHandler<VersionFormData>>(
		async (values) => {
			return client.version
				.create(projectId, values.file)
				.then(() => {
					toggleSnackbar("Versão submetida com sucesso");
					reset(defaultValues);
					handleDialog(false, true);
				})
				.catch((err) => {
					const msg =
						err.response?.data.msg ??
						"Algo deu errado, tente novamente";
					toggleSnackbar(msg);
				});
		},
		[defaultValues, handleDialog, projectId, reset, toggleSnackbar]
	);

	const handleClose = useCallback(() => {
		if (isDirty) {
			setCancelDialogOpen(true);
		} else {
			handleDialog(false);
		}
	}, [isDirty, handleDialog]);

	return (
		<>
			<Dialog open={dialogOpen} onClose={handleClose}>
				<Container
					component="form"
					onSubmit={handleSubmit(onSubmit)}
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "16px",
						padding: "16px 0",
					}}
				>
					<Typography variant="h6">Submeter nova versão</Typography>
					<Controller
						control={control}
						name="file"
						render={({ field }) => (
							<TextField
								label="Arquivo"
								error={!!errors.file}
								helperText={errors.file && errors.file.message}
								type="file"
								InputLabelProps={{
									shrink: true,
								}}
								inputProps={{
									accept: "application/pdf",
								}}
								onChange={(e) => {
									field.onChange((e.target as any).files![0]);
								}}
							/>
						)}
					/>
					<Button
						type="submit"
						variant="contained"
						disabled={isSubmitting}
						size="large"
						sx={{
							minWidth: "320px",
							borderRadius: theme.spacing(1),
						}}
					>
						{isSubmitting ? "Carregando" : "Submeter"}
					</Button>
				</Container>
			</Dialog>
			<BaseDialog
				open={cancelDialogOpen}
				onCancel={() => setCancelDialogOpen(false)}
				onConfirm={() => {
					reset(defaultValues);
					setCancelDialogOpen(false);
					handleDialog(false);
				}}
				text="Tem certeza que deseja descartar? Você irá perder os dados informados"
			/>
		</>
	);
};
