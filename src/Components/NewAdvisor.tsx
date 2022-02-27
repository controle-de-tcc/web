import {
	Button,
	capitalize,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	MenuItem,
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
import { AdvisorRoles } from "Types/auth";

type AdvisorFormData = {
	siape: string;
	email: string;
	name: string;
	password: string;
	type: AdvisorRoles;
};

const formSchema: yup.SchemaOf<AdvisorFormData> = yup.object({
	siape: yup.string().required("Preencha o campo"),
	email: yup.string().required("Preencha o campo").email("E-mail inválido"),
	name: yup.string().required("Preencha o campo"),
	password: yup.string().required("Preencha o campo"),
	type: yup.mixed().oneOf([AdvisorRoles.Advisor, AdvisorRoles.Reviewer]),
});

type NewAdvisorProps = {
	dialogOpen: boolean;
	handleDialog(value: boolean, update?: boolean): void;
};

export const NewAdvisor = ({ dialogOpen, handleDialog }: NewAdvisorProps) => {
	const theme = useTheme();
	const { toggleSnackbar } = useSnackbar();

	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

	const defaultValues = {
		siape: "",
		name: "",
		email: "",
		password: "",
		type: AdvisorRoles.Advisor,
	};

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<AdvisorFormData>({
		resolver: yupResolver(formSchema),
		defaultValues,
	});

	const onSubmit = useCallback<SubmitHandler<AdvisorFormData>>(
		async (values) => {
			return client.advisor
				.create({
					siape: parseInt(values.siape),
					nome: values.name,
					email: values.email,
					senha: values.password,
					tipoProfessor: values.type,
				})
				.then(() => {
					toggleSnackbar("Professor cadastrado com sucesso");
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
					<Typography variant="h6">
						Cadastrar novo professor
					</Typography>
					<Controller
						control={control}
						name="siape"
						render={({ field }) => (
							<TextField
								label="SIAPE"
								error={!!errors.siape}
								helperText={
									errors.siape && errors.siape.message
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
					<Controller
						control={control}
						name="type"
						render={({ field }) => (
							<TextField
								label="Tipo de professor"
								error={!!errors.type}
								helperText={errors.type && errors.type.message}
								select
								{...field}
							>
								<MenuItem value={AdvisorRoles.Advisor}>
									{capitalize(AdvisorRoles.Advisor)}
								</MenuItem>
								<MenuItem value={AdvisorRoles.Reviewer}>
									{capitalize(AdvisorRoles.Reviewer)}
								</MenuItem>
							</TextField>
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
