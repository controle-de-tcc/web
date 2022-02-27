import {
	Autocomplete,
	Button,
	Checkbox,
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
import {
	useForm,
	Controller,
	SubmitHandler,
	FieldError,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "Hooks/useSnackbar";
import { useCallback, useEffect, useState } from "react";
import { StudentData } from "Types/student";
import { client } from "Services";
import { AdvisorData } from "Types/advisor";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { AdvisorRoles } from "Types/auth";
import { useAuth } from "Hooks/useAuth";

type ProjectFormData = {
	title: string;
	student: number;
	reviewers: AdvisorData[];
};

const formSchema = yup.object({
	title: yup.string().required("Preencha o campo"),
	student: yup.number().required("Preencha o campo").min(1, "Aluno inválido"),
	reviewers: yup.array().min(1, "Selecione ao menos um avaliador"),
});

type NewProjectProps = {
	dialogOpen: boolean;
	handleDialog(value: boolean, update?: boolean): void;
};

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

export const NewProject = ({ dialogOpen, handleDialog }: NewProjectProps) => {
	const theme = useTheme();
	const { auth } = useAuth();
	const { toggleSnackbar } = useSnackbar();

	const [students, setStudents] = useState<Array<StudentData>>([]);
	const [advisors, setAdvisors] = useState<Array<AdvisorData>>([]);
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

	useEffect(() => {
		client.advisor
			.list()
			.then((res) => {
				setAdvisors(res);
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
		reviewers: [],
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
					siape_orientador: Number(auth?.user?.siape),
					avaliadores: values.reviewers.map((x) => x.siape),
				})
				.then(() => {
					toggleSnackbar("Projeto cadastrado com sucesso");
					handleDialog(false, true);
				})
				.catch((err) => {
					const msg =
						err.response?.data.msg ??
						"Algo deu errado, tente novamente";
					toggleSnackbar(msg);
				});
		},
		[auth, handleDialog, toggleSnackbar]
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
					<Controller
						control={control}
						name="reviewers"
						render={({ field }) => (
							<Autocomplete
								multiple
								options={advisors.filter(
									(advisor) =>
										advisor.tipo_professor ===
										AdvisorRoles.Reviewer
								)}
								disableCloseOnSelect
								getOptionLabel={(option) => option.nome}
								renderOption={(props, option, { selected }) => (
									<li {...props}>
										<Checkbox
											icon={icon}
											checkedIcon={checkedIcon}
											style={{ marginRight: 8 }}
											checked={selected}
										/>
										{option.nome}
									</li>
								)}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Avaliadores"
										placeholder="Selecione os avaliadores"
										error={!!errors.reviewers}
										helperText={
											errors.reviewers &&
											(
												errors.reviewers as unknown as FieldError
											).message
										}
									/>
								)}
								value={field.value}
								onChange={(_, value) => {
									field.onChange(value);
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
