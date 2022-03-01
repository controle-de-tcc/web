import { Add, Download } from "@mui/icons-material";
import { Button, Divider, IconButton, Typography } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { NewSuggestion } from "Components/NewSuggestion";
import { PageContainer } from "Components/PageContainer";
import { Table } from "Components/Table";
import dayjs from "dayjs";
import { useAuth } from "Hooks/useAuth";
import { useSnackbar } from "Hooks/useSnackbar";
import { useCallback, useEffect, useState } from "react";
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
	const { toggleSnackbar } = useSnackbar();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [projectVersion, setProjectVersion] =
		useState<ProjectVersionGetResponse>();

	const getProjectVersion = useCallback(() => {
		client.project
			.getByVersion(Number(id_versao))
			.then((res) => {
				setProjectVersion(res);
			})
			.catch((err) => {
				const msg =
					err.response?.data.msg ??
					"Algo deu errado, tente novamente";
				toggleSnackbar(msg);
			});
	}, [id_versao, toggleSnackbar]);

	useEffect(() => {
		getProjectVersion();
	}, [getProjectVersion]);

	const handleDialog = useCallback(
		(value: boolean, update = false) => {
			setDialogOpen(value);
			if (update) {
				getProjectVersion();
			}
		},
		[getProjectVersion]
	);

	return (
		<PageContainer title="Detalhes da versão">
			<Typography
				variant="h4"
				color="primary.main"
				fontWeight="500"
				sx={{ marginBottom: "16px" }}
			>
				Detalhes de projeto
			</Typography>
			<Divider style={{ margin: "16px 0" }} />
			<Typography
				variant="body1"
				color="black"
				fontWeight="light"
				sx={{ marginBottom: "4px" }}
			>
				<Typography fontWeight="400">Projeto:</Typography>{" "}
				{projectVersion?.projeto.titulo}
			</Typography>
			<Typography
				variant="body1"
				color="black"
				fontWeight="light"
				sx={{ marginBottom: "4px" }}
			>
				<Typography fontWeight="400">Versão:</Typography>{" "}
				{projectVersion?.id}
			</Typography>
			<Typography
				variant="body1"
				color="black"
				fontWeight="light"
				sx={{ marginBottom: "4px" }}
			>
				<Typography fontWeight="400">Aluno:</Typography>{" "}
				{projectVersion?.projeto.aluno.nome}
			</Typography>
			<Typography
				variant="body1"
				color="black"
				fontWeight="light"
				sx={{ marginBottom: "4px" }}
			>
				<Typography fontWeight="400">Arquivo:</Typography>{" "}
				{projectVersion?.arquivo}
				<IconButton
					onClick={() => {
						window.open(
							`http://localhost:8080/public/documents/${projectVersion?.arquivo}`,
							"_blank"
						);
					}}
					style={{ marginLeft: "4px" }}
				>
					<Download fontSize="small" />
				</IconButton>
			</Typography>
			<Typography variant="body1" color="black" fontWeight="light">
				<Typography fontWeight="400">Submetido em:</Typography>{" "}
				{dayjs(projectVersion?.created_at).format("DD/MM/YYYY HH:mm")}
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
			{auth?.userType === UserRoles.Advisor &&
				(projectVersion?.projeto.orientador.siape === auth.user.siape ||
					projectVersion?.projeto.avaliadores.some(
						(x) => x.avaliador.siape === auth.user?.siape
					)) && (
					<Button
						type="button"
						onClick={() => setDialogOpen(true)}
						variant="contained"
						color="primary"
					>
						<Add sx={{ marginRight: "8px" }} />
						Realizar sugestão
					</Button>
				)}
			{projectVersion?.sugestoes.length === 0 ? (
				<Typography
					variant="body1"
					color="black"
					fontWeight="light"
					fontStyle="italic"
					style={{ marginTop: "16px" }}
				>
					Ainda não foram feitas sugestões
				</Typography>
			) : (
				<Table
					rows={projectVersion?.sugestoes || []}
					columns={columns}
				/>
			)}
			<NewSuggestion
				dialogOpen={dialogOpen}
				handleDialog={handleDialog}
				versionId={Number(id_versao)}
			/>
		</PageContainer>
	);
};
