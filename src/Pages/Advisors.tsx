import { Add } from "@mui/icons-material";
import { Button, capitalize, Paper, Typography } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { NewAdvisor } from "Components/NewAdvisor";
import { PageContainer } from "Components/PageContainer";
import { useSnackbar } from "Hooks/useSnackbar";
import { useCallback, useEffect, useState } from "react";
import { client } from "Services";
import { AdvisorListResponse } from "Services/advisor";

const columns: GridColumns = [
	{ field: "siape", headerName: "SIAPE", flex: 1 },
	{ field: "nome", headerName: "Nome", flex: 2 },
	{ field: "email", headerName: "E-mail", flex: 3 },
	{
		field: "tipoProfessor",
		headerName: "Tipo",
		flex: 1,
		valueGetter: ({ row }: { row: AdvisorListResponse }) =>
			capitalize(row.tipoProfessor),
	},
];

export const Advisors = () => {
	const { toggleSnackbar } = useSnackbar();

	const [advisors, setAdvisors] = useState<Array<AdvisorListResponse>>([]);
	const [dialogOpen, setDialogOpen] = useState(false);

	const listAdvisors = useCallback(() => {
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

	useEffect(() => {
		listAdvisors();
	}, [listAdvisors]);

	const handleDialog = useCallback(
		(value: boolean, update = false) => {
			setDialogOpen(value);
			if (update) {
				listAdvisors();
			}
		},
		[listAdvisors]
	);

	return (
		<PageContainer title="Professores">
			<Typography
				variant="h4"
				color="primary.main"
				fontWeight="500"
				sx={{ marginBottom: "16px" }}
			>
				Professores
			</Typography>
			<Button
				type="button"
				onClick={() => setDialogOpen(true)}
				variant="contained"
				color="primary"
			>
				<Add sx={{ marginRight: "8px" }} />
				Cadastrar novo professor
			</Button>
			<Paper sx={{ height: "400px", marginTop: "16px" }}>
				<DataGrid
					rows={advisors}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5]}
					checkboxSelection
					getRowId={(row) => row.siape}
				/>
			</Paper>
			{/* Isso é um dialog */}
			<NewAdvisor dialogOpen={dialogOpen} handleDialog={handleDialog} />
		</PageContainer>
	);
};
