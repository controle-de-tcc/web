import {
	Button,
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
import { useCallback, useEffect, useState } from "react";
import { StudentData } from "Types/student";
import { client } from "Services";

type ProjectFormData = {
	title: string;
	student: number;
};

const formSchema: yup.SchemaOf<ProjectFormData> = yup.object({
	title: yup.string().required("Preencha o campo"),
	student: yup.number().required("Preencha o campo").min(1, "Aluno inválido"),
});

type NewProjectProps = {
	dialogOpen: boolean;
	setDialogOpen(value: boolean): void;
};

export const NewProject = ({ dialogOpen, setDialogOpen }: NewProjectProps) => {
	const theme = useTheme();
	const { toggleSnackbar } = useSnackbar();

	const [students, setStudents] = useState<Array<StudentData>>([]);
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

	useEffect(() => {
		client.student
			.list()
			.then((res) => {
				setStudents(res);
			})
			.catch((err) => {
				const msg =
					err.response?.data.msg ??
					"Algo deu errado, tente novamente";
				toggleSnackbar(msg);
			});
	}, [toggleSnackbar]);

	const defaultValues = {
		title: "",
		student: -1,
	};

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<ProjectFormData>({
		resolver: yupResolver(formSchema),
		defaultValues,
	});

	const onSubmit = useCallback<SubmitHandler<ProjectFormData>>(
		async (values) => {
			return client.project
				.create({
					titulo: values.title,
					mat_aluno: values.student,
				})
				.then(() => {
					toggleSnackbar("Projeto cadastrado com sucesso");
					setDialogOpen(false);
				})
				.catch((err) => {
					const msg =
						err.response?.data.msg ??
						"Algo deu errado, tente novamente";
					toggleSnackbar(msg);
				});
		},
		[setDialogOpen, toggleSnackbar]
	);

	const handleClose = useCallback(() => {
		if (isDirty) {
			setCancelDialogOpen(true);
		} else {
			setDialogOpen(false);
		}
	}, [isDirty, setDialogOpen]);

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
					<Typography variant="h6">Cadastrar novo projeto</Typography>
					<Controller
						control={control}
						name="title"
						render={({ field }) => (
							<TextField
								label="Título"
								error={!!errors.title}
								helperText={
									errors.title && errors.title.message
								}
								{...field}
							/>
						)}
					/>
					<Controller
						control={control}
						name="student"
						render={({ field }) => (
							<TextField
								label="Aluno"
								error={!!errors.student}
								helperText={
									errors.student && errors.student.message
								}
								type="student"
								select
								{...field}
							>
								<MenuItem value={-1} disabled>
									Selecione um aluno
								</MenuItem>
								{students.map((student) => (
									<MenuItem
										key={student.matricula}
										value={student.matricula}
									>
										{student.nome} - {student.email}
									</MenuItem>
								))}
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
							setDialogOpen(false);
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
