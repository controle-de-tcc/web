import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { NewProject } from "Components/NewProject";
import { PageContainer } from "Components/PageContainer";
import { Table } from "Components/Table";
import { useSnackbar } from "Hooks/useSnackbar";
import { useCallback, useEffect, useState } from "react";
import { client } from "Services";
import { ProjectListResponse } from "Services/project";
import dayjs from "dayjs";
import { useAuth } from "Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Locations } from "Types/routes";

const columns: GridColumns = [
	{ field: "id", headerName: "ID", flex: 1 },
	{ field: "titulo", headerName: "Título", flex: 1 },
	{
		field: "aluno",
		headerName: "Aluno",
		flex: 1,
		valueGetter: ({ row }: { row: ProjectListResponse }) => row.aluno.nome,
	},
	{
		field: "orientador",
		headerName: "Orientador",
		flex: 1,
		valueGetter: ({ row }: { row: ProjectListResponse }) =>
			row.orientador.nome,
	},
	{
		field: "avaliadores",
		headerName: "Avaliadores",
		flex: 2,
		valueGetter: ({ row }: { row: ProjectListResponse }) =>
			row.avaliadores
				.map((x) => x.avaliador.nome)
				.reduce(
					(acc, cur, idx) =>
						(acc +=
							cur +
							(idx < row.avaliadores.length - 1 ? ", " : "")),
					""
				),
	},
	{
		field: "created_at",
		headerName: "Criado em",
		flex: 1,
		valueGetter: ({ row }: { row: ProjectListResponse }) =>
			dayjs(row.created_at).format("DD/MM/YYYY HH:mm"),
	},
];

type ProjectsProps = {
	isAdvisor: boolean;
};

export const Projects = ({ isAdvisor }: ProjectsProps) => {
	const navigate = useNavigate();
	const { toggleSnackbar } = useSnackbar();
	const { auth } = useAuth();

	const [projects, setProjects] = useState<Array<ProjectListResponse>>([]);
	const [dialogOpen, setDialogOpen] = useState(false);

	const listProjects = useCallback(() => {
		let query = client.project.list;
		if (!isAdvisor)
			query = () => client.project.list(Number(auth?.user.siape));
		query()
			.then((res) => {
				setProjects(res);
			})
			.catch((err) => {
				const msg =
					err.response?.data.msg ??
					"Algo deu errado, tente novamente";
				toggleSnackbar(msg);
			});
	}, [auth, isAdvisor, toggleSnackbar]);

	useEffect(() => {
		listProjects();
	}, [listProjects]);

	const handleDialog = useCallback(
		(value: boolean, update = false) => {
			setDialogOpen(value);
			if (update) {
				listProjects();
			}
		},
		[listProjects]
	);

	return (
		<PageContainer title="Projetos">
			<Typography
				variant="h4"
				color="primary.main"
				fontWeight="500"
				sx={{ marginBottom: "16px" }}
			>
				Projetos
			</Typography>
			{isAdvisor && (
				<Button
					type="button"
					onClick={() => setDialogOpen(true)}
					variant="contained"
					color="primary"
				>
					<Add sx={{ marginRight: "8px" }} />
					Cadastrar novo projeto
				</Button>
			)}
			<Table
				rows={projects}
				columns={columns}
				onRowDoubleClick={(params) => {
					const row = params.row as ProjectListResponse;
					navigate(
						Locations.ProjectDetails.replace(
							":mat_aluno",
							String(row.aluno.matricula)
						)
					);
				}}
			/>
			{/* Isso é um dialog */}
			<NewProject dialogOpen={dialogOpen} handleDialog={handleDialog} />
		</PageContainer>
	);
};
