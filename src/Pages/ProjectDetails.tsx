import { Download } from "@mui/icons-material";
import { Divider, IconButton, Typography } from "@mui/material";
import { NewVersion } from "Components/NewVersion";
import { PageContainer } from "Components/PageContainer";
import { useAuth } from "Hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { client } from "Services";
import { ProjectGetResponse } from "Services/project";
import { UserRoles } from "Types/auth";
import dayjs from "dayjs";
import { GridColumns } from "@mui/x-data-grid";
import { Locations } from "Types/routes";
import { VersionData } from "Types/project";
import { formatReviewers } from "Lib/helpers";
import { CRUD } from "Components/CRUD";

const columns: GridColumns = [
	{ field: "id", headerName: "ID", width: 96 },
	{
		field: "arquivo",
		headerName: "Arquivo",
		flex: 1,
		valueGetter: ({ row }: { row: VersionData }) => row.arquivo,
	},

	{
		field: "created_at",
		headerName: "Submetida em",
		width: 256,
		valueGetter: ({ row }: { row: VersionData }) =>
			dayjs(row.created_at).format("DD/MM/YYYY HH:mm"),
	},
	{
		field: "updated_at",
		headerName: "Ações",
		width: 96,
		renderCell: ({ row }: { row: VersionData }) => (
			<IconButton
				onClick={() => {
					window.open(
						`http://localhost:8080/public/documents/${row.arquivo}`,
						"_blank"
					);
				}}
			>
				<Download />
			</IconButton>
		),
	},
];

export const ProjectDetails = () => {
	const navigate = useNavigate();
	const { mat_aluno } = useParams<{ mat_aluno: string }>();
	const { auth } = useAuth();

	const hasPermissions = () =>
		auth?.user_type === UserRoles.Student &&
		auth?.user.matricula === Number(mat_aluno);

	return (
		<PageContainer title="Detalhes do projeto">
			<CRUD<ProjectGetResponse>
				title="Detalhes do projeto"
				renderAdd={() =>
					hasPermissions() ? "Submeter nova versão" : null
				}
				onDelete={client.version.delete}
				renderBody={(data) => (
					<>
						<Divider style={{ margin: "16px 0" }} />
						<Typography
							variant="body1"
							color="black"
							fontWeight="light"
							sx={{ marginBottom: "4px" }}
						>
							<Typography fontWeight="400">Projeto:</Typography>{" "}
							{data.titulo}
						</Typography>
						<Typography
							variant="body1"
							color="black"
							fontWeight="light"
							sx={{ marginBottom: "4px" }}
						>
							<Typography fontWeight="400">
								Orientador:
							</Typography>{" "}
							{data.orientador?.nome}
						</Typography>
						<Typography
							variant="body1"
							color="black"
							fontWeight="light"
						>
							<Typography fontWeight="400">
								Avaliadores:
							</Typography>{" "}
							{formatReviewers(data.avaliadores || [])}
						</Typography>
						<Divider style={{ margin: "16px 0" }} />
						<Typography
							variant="h6"
							color="black"
							fontWeight="light"
							sx={{ marginBottom: "16px" }}
						>
							Histórico de versões
						</Typography>
					</>
				)}
				initialData={{} as ProjectGetResponse}
				getDataService={() =>
					client.project.getByStudent(Number(mat_aluno))
				}
				getRows={(data) => data.versoes}
				columns={columns}
				tableProps={{
					isRowSelectable: () => hasPermissions(),
					onRowDoubleClick: (params) => {
						const row = params.row as VersionData;
						navigate(
							Locations.ProjectVersion.replace(
								":id_projeto",
								String(row.id_projeto)
							).replace(":id_versao", String(row.id))
						);
					},
				}}
				renderForm={(dialogOpen, handleDialog, data) => (
					<NewVersion
						dialogOpen={dialogOpen}
						handleDialog={handleDialog}
						projectId={data.id}
					/>
				)}
			/>
		</PageContainer>
	);
};
