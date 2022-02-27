import { Add } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { NewProject } from "Components/NewProject";
import { PageContainer } from "Components/PageContainer";
import { useSnackbar } from "Hooks/useSnackbar";
import { useCallback, useEffect, useState } from "react";
import { client } from "Services";
import { ProjectListResponse } from "Services/project";

const columns: GridColumns = [
	{ field: "id", headerName: "ID", width: 70 },
	{ field: "titulo", headerName: "Título", width: 200 },
	{
		field: "aluno",
		headerName: "Aluno",
		minWidth: 200,
		flex: 1,
		valueGetter: ({ row }: { row: ProjectListResponse }) =>
			`${row.aluno.nome}, Matrícula ${row.aluno.matricula}`,
	},
];

export const Projects = () => {
	const { toggleSnackbar } = useSnackbar();

	const [projects, setProjects] = useState<Array<ProjectListResponse>>([]);
	const [dialogOpen, setDialogOpen] = useState(false);

	const listProjects = useCallback(() => {
		client.project
			.list()
			.then((res) => {
				setProjects(res);
			})
			.catch((err) => {
				const msg =
					err.response?.data.msg ??
					"Algo deu errado, tente novamente";
				toggleSnackbar(msg);
			});
	}, [toggleSnackbar]);

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
			<Button
				type="button"
				onClick={() => setDialogOpen(true)}
				variant="contained"
				color="primary"
			>
				<Add sx={{ marginRight: "8px" }} />
				Cadastrar novo projeto
			</Button>
			<Paper sx={{ minHeight: "400px", marginTop: "16px" }}>
				<DataGrid
					rows={projects}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5]}
					checkboxSelection
				/>
			</Paper>
			{/* Isso é um dialog */}
			<NewProject dialogOpen={dialogOpen} handleDialog={handleDialog} />
		</PageContainer>
	);
};
