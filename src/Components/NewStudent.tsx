import {
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "Hooks/useSnackbar";
import { useCallback, useState } from "react";
import { client } from "Services";

type StudentFormData = {
	registration: string;
	email: string;
	name: string;
	password: string;
};

const formSchema: yup.SchemaOf<StudentFormData> = yup.object({
	registration: yup.string().required("Preencha o campo"),
	email: yup.string().required("Preencha o campo").email("E-mail inválido"),
	name: yup.string().required("Preencha o campo"),
	password: yup.string().required("Preencha o campo"),
});

type NewStudentProps = {
	dialogOpen: boolean;
	handleDialog(value: boolean, update?: boolean): void;
};

export const NewStudent = ({ dialogOpen, handleDialog }: NewStudentProps) => {
	const theme = useTheme();
	const { toggleSnackbar } = useSnackbar();

	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

	const defaultValues = {
		registration: "",
		name: "",
		email: "",
		password: "",
	};

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<StudentFormData>({
		resolver: yupResolver(formSchema),
		defaultValues,
	});

	const onSubmit = useCallback<SubmitHandler<StudentFormData>>(
		async (values) => {
			return client.student
				.create({
					matricula: parseInt(values.registration),
					nome: values.name,
					email: values.email,
					senha: values.password,
				})
				.then(() => {
					toggleSnackbar("Aluno cadastrado com sucesso");
					handleDialog(false, true);
				})
				.catch((err) => {
					const msg =
						err.response?.data.msg ??
						"Algo deu errado, tente novamente";
					toggleSnackbar(msg);
				});
		},
		[handleDialog, toggleSnackbar]
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
					<Typography variant="h6">Cadastrar novo aluno</Typography>
					<Controller
						control={control}
						name="registration"
						render={({ field }) => (
							<TextField
								label="Matrícula"
								error={!!errors.registration}
								helperText={
									errors.registration &&
									errors.registration.message
								}
								{...field}
							/>
						)}
					/>
					<Controller
						control={control}
						name="name"
						render={({ field }) => (
							<TextField
								label="Nome"
								error={!!errors.name}
								helperText={errors.name && errors.name.message}
								{...field}
							/>
						)}
					/>
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<TextField
								label="E-mail"
								error={!!errors.email}
								helperText={
									errors.email && errors.email.message
								}
								type="email"
								{...field}
							/>
						)}
					/>
					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<TextField
								label="Senha"
								error={!!errors.password}
								helperText={
									errors.password && errors.password.message
								}
								type="password"
								{...field}
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
						{isSubmitting ? "Carregando" : "Cadastrar"}
					</Button>
				</Container>
			</Dialog>
			<Dialog
				open={cancelDialogOpen}
				onClose={() => setCancelDialogOpen(false)}
			>
				<DialogContent>
					<DialogContentText>
						Tem certeza que deseja descartar? Você irá perder os
						dados informados
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setCancelDialogOpen(false)}>
						Cancelar
					</Button>
					<Button
						onClick={() => {
							reset(defaultValues);
							setCancelDialogOpen(false);
							handleDialog(false);
						}}
						color="error"
					>
						Descartar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
