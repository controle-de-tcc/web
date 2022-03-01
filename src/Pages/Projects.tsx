import { GridColumns } from "@mui/x-data-grid";
import { NewProject } from "Components/NewProject";
import { PageContainer } from "Components/PageContainer";
import { useCallback } from "react";
import { client } from "Services";
import { ProjectListResponse } from "Services/project";
import dayjs from "dayjs";
import { useAuth } from "Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Locations } from "Types/routes";
import { formatReviewers } from "Lib/helpers";
import { CRUD } from "Components/CRUD";

const columns: GridColumns = [
	{ field: "id", headerName: "ID", width: 64 },
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
			formatReviewers(row.avaliadores),
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
	const { auth } = useAuth();

	const getDataService = useCallback(() => {
		if (isAdvisor) return client.project.list;
		return () => client.project.list(Number(auth?.user.siape));
	}, [auth, isAdvisor]);

	return (
		<PageContainer title="Projetos">
			<CRUD<Array<ProjectListResponse>>
				title="Projetos"
				renderAdd={() => (isAdvisor ? "Cadastrar novo projeto" : null)}
				onDelete={client.project.delete}
				initialData={[]}
				getDataService={getDataService()}
				getRows={(data) => data}
				columns={columns}
				tableProps={{
					isRowSelectable: () => isAdvisor,
					onRowDoubleClick: (params) => {
						const row = params.row as ProjectListResponse;
						navigate(
							Locations.ProjectDetails.replace(
								":mat_aluno",
								String(row.aluno.matricula)
							)
						);
					},
				}}
				renderForm={(dialogOpen, handleDialog) => (
					<NewProject
						dialogOpen={dialogOpen}
						handleDialog={handleDialog}
					/>
				)}
			/>
		</PageContainer>
	);
};
