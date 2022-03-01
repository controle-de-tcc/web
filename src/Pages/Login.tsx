import {
	Box,
	Button,
	Paper,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback } from "react";
import { Lock, Person, Send } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { client } from "Services";
import { useSnackbar } from "Hooks/useSnackbar";
import { useAuth } from "Hooks/useAuth";
import { Helmet } from "react-helmet";

type LoginFormData = {
	email: string;
	password: string;
};

const formSchema: yup.SchemaOf<LoginFormData> = yup.object({
	email: yup.string().required("Preencha o campo").email("E-mail inválido"),
	password: yup.string().required("Preencha o campo"),
});

export const Login = () => {
	const theme = useTheme();
	const { toggleSnackbar } = useSnackbar();
	const { updateAuth } = useAuth();
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: yupResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = useCallback<SubmitHandler<LoginFormData>>(
		async (values) => {
			return client.auth
				.login(values.email, values.password)
				.then((res) => {
					toggleSnackbar("Login realizado com sucesso");
					updateAuth(res);
					navigate("/dashboard");
				})
				.catch((err) => {
					const msg =
						err.response?.data.msg ??
						"Algo deu errado, tente novamente";
					toggleSnackbar(msg);
				});
		},
		[navigate, updateAuth, toggleSnackbar]
	);

	return (
		<>
			<Helmet>
				<title>Login</title>
			</Helmet>
			<Box
				sx={{
					height: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundImage:
						"linear-gradient(225deg, #4A5A6A, #333333)",
				}}
			>
				<Paper
					sx={{
						padding: theme.spacing(4),
						display: "flex",
						flexDirection: "column",
						gap: theme.spacing(2.5),
						width: "100%",
						maxWidth: theme.spacing(48),
						borderRadius: theme.spacing(2),
					}}
					component="form"
					onSubmit={handleSubmit(onSubmit)}
				>
					<Typography
						variant="h5"
						sx={{ fontWeight: "bold", alignSelf: "center" }}
					>
						Login
					</Typography>
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
								InputProps={{
									startAdornment: (
										<Person
											sx={{
												marginRight: theme.spacing(1),
											}}
										/>
									),
								}}
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
								InputProps={{
									startAdornment: (
										<Lock
											sx={{
												marginRight: theme.spacing(1),
											}}
										/>
									),
								}}
								{...field}
							/>
						)}
					/>
					<Button
						type="submit"
						variant="contained"
						disabled={isSubmitting}
						size="large"
						sx={{ borderRadius: theme.spacing(1) }}
						endIcon={
							<Send
								sx={{
									transform:
										"translateY(-3px) rotate(315deg)",
								}}
							/>
						}
					>
						{isSubmitting ? "Carregando" : "Enviar"}
					</Button>
				</Paper>
			</Box>
		</>
	);
};
