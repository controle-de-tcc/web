import { Add, Download } from "@mui/icons-material";
import { Button, Divider, IconButton, Typography } from "@mui/material";
import { NewVersion } from "Components/NewVersion";
import { PageContainer } from "Components/PageContainer";
import { Table } from "Components/Table";
import { useAuth } from "Hooks/useAuth";
import { useSnackbar } from "Hooks/useSnackbar";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { client } from "Services";
import { ProjectGetResponse } from "Services/project";
import { UserRoles } from "Types/auth";
import dayjs from "dayjs";
import { GridColumns } from "@mui/x-data-grid";
import { Locations } from "Types/routes";
import { VersionData } from "Types/project";
import { formatReviewers } from "Lib/helpers";

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
	const { toggleSnackbar } = useSnackbar();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [project, setProject] = useState<ProjectGetResponse>();

	const getProject = useCallback(() => {
		client.project
			.getByStudent(Number(mat_aluno))
			.then((res) => {
				setProject(res);
			})
			.catch((err) => {
				const msg =
					err.response?.data.msg ??
					"Algo deu errado, tente novamente";
				toggleSnackbar(msg);
			});
	}, [mat_aluno, toggleSnackbar]);

	useEffect(() => {
		getProject();
	}, [getProject]);

	const handleDialog = useCallback(
		(value: boolean, update = false) => {
			setDialogOpen(value);
			if (update) {
				getProject();
			}
		},
		[getProject]
	);

	return (
		<PageContainer title={`Projeto - ${project?.titulo}`}>
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
				{project?.titulo}
			</Typography>
			<Typography
				variant="body1"
				color="black"
				fontWeight="light"
				sx={{ marginBottom: "4px" }}
			>
				<Typography fontWeight="400">Orientador:</Typography>{" "}
				{project?.orientador.nome}
			</Typography>
			<Typography variant="body1" color="black" fontWeight="light">
				<Typography fontWeight="400">Avaliadores:</Typography>{" "}
				{formatReviewers(project?.avaliadores || [])}
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
			{auth?.userType === UserRoles.Student &&
				auth?.user.matricula === Number(mat_aluno) && (
					<Button
						type="button"
						onClick={() => setDialogOpen(true)}
						variant="contained"
						color="primary"
					>
						<Add sx={{ marginRight: "8px" }} />
						Submeter nova versão
					</Button>
				)}
			{project?.versoes.length === 0 ? (
				<Typography
					variant="body1"
					color="black"
					fontWeight="light"
					fontStyle="italic"
					style={{ marginTop: "16px" }}
				>
					Ainda não foram submetidas versões
				</Typography>
			) : (
				<Table
					rows={project?.versoes || []}
					columns={columns}
					onRowDoubleClick={(params) => {
						const row = params.row as VersionData;
						navigate(
							Locations.ProjectVersion.replace(
								":id_projeto",
								String(project?.id)
							).replace(":id_versao", String(row.id))
						);
					}}
				/>
			)}
			{project && (
				<NewVersion
					dialogOpen={dialogOpen}
					handleDialog={handleDialog}
					projectId={project.id}
				/>
			)}
		</PageContainer>
	);
};
