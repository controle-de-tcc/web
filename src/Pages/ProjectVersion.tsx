import { Download } from "@mui/icons-material";
import { Divider, IconButton, Typography } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { CRUD } from "Components/CRUD";
import { NewSuggestion } from "Components/NewSuggestion";
import { PageContainer } from "Components/PageContainer";
import dayjs from "dayjs";
import { useAuth } from "Hooks/useAuth";
import { useParams } from "react-router-dom";
import { client } from "Services";
import { ProjectVersionGetResponse } from "Services/project";
import { UserRoles } from "Types/auth";
import { SuggestionData } from "Types/project";

const columns: GridColumns = [
	{ field: "id", headerName: "ID", width: 64 },
	{
		field: "professor",
		headerName: "Professor",
		flex: 1,
		valueGetter: ({ row }: { row: SuggestionData }) => row.professor.nome,
	},
	{
		field: "texto",
		headerName: "Sugestões",
		flex: 3,
	},
	{
		field: "arquivo",
		headerName: "Arquivo",
		flex: 2,
		valueGetter: ({ row }: { row: SuggestionData }) => row.arquivo,
	},
	{
		field: "created_at",
		headerName: "Realizada em",
		width: 200,
		valueGetter: ({ row }: { row: SuggestionData }) =>
			dayjs(row.created_at).format("DD/MM/YYYY HH:mm"),
	},
	{
		field: "updated_at",
		headerName: "Ações",
		width: 96,
		renderCell: ({ row }: { row: SuggestionData }) => (
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

export const ProjectVersion = () => {
	const { id_versao } =
		useParams<{ id_projeto: string; id_versao: string }>();
	const { auth } = useAuth();

	const shouldRenderAdd = (data: ProjectVersionGetResponse) =>
		auth?.userType === UserRoles.Advisor &&
		(data.projeto?.orientador.siape === auth?.user.siape ||
			data.projeto?.avaliadores.some(
				(x) => x.avaliador.siape === auth?.user?.siape
			));

	return (
		<PageContainer title="Detalhes da versão">
			<CRUD<ProjectVersionGetResponse>
				title="Detalhes da versão"
				renderAdd={(data) =>
					shouldRenderAdd(data) ? "Realizar sugestão" : null
				}
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
							{data.projeto?.titulo}
						</Typography>
						<Typography
							variant="body1"
							color="black"
							fontWeight="light"
							sx={{ marginBottom: "4px" }}
						>
							<Typography fontWeight="400">Versão:</Typography>{" "}
							{data.id}
						</Typography>
						<Typography
							variant="body1"
							color="black"
							fontWeight="light"
							sx={{ marginBottom: "4px" }}
						>
							<Typography fontWeight="400">Aluno:</Typography>{" "}
							{data.projeto?.aluno.nome}
						</Typography>
						<Typography
							variant="body1"
							color="black"
							fontWeight="light"
							sx={{ marginBottom: "4px" }}
						>
							<Typography fontWeight="400">Arquivo:</Typography>{" "}
							{data.arquivo}
							<IconButton
								onClick={() => {
									window.open(
										`http://localhost:8080/public/documents/${data.arquivo}`,
										"_blank"
									);
								}}
								style={{ marginLeft: "4px" }}
							>
								<Download fontSize="small" />
							</IconButton>
						</Typography>
						<Typography
							variant="body1"
							color="black"
							fontWeight="light"
						>
							<Typography fontWeight="400">
								Submetido em:
							</Typography>{" "}
							{dayjs(data.created_at).format("DD/MM/YYYY HH:mm")}
						</Typography>
						<Divider style={{ margin: "16px 0" }} />
						<Typography
							variant="h6"
							color="black"
							fontWeight="light"
							sx={{ marginBottom: "16px" }}
						>
							Sugestões
						</Typography>
					</>
				)}
				initialData={{} as ProjectVersionGetResponse}
				getDataService={() =>
					client.project.getByVersion(Number(id_versao))
				}
				getRows={(data) => data.sugestoes}
				columns={columns}
				renderForm={(dialogOpen, handleDialog) => (
					<NewSuggestion
						dialogOpen={dialogOpen}
						handleDialog={handleDialog}
						versionId={Number(id_versao)}
					/>
				)}
			/>
		</PageContainer>
	);
};
