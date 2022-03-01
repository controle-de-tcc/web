import { capitalize } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { NewAdvisor } from "Components/NewAdvisor";
import { PageContainer } from "Components/PageContainer";
import { client } from "Services";
import { AdvisorListResponse } from "Services/advisor";
import dayjs from "dayjs";
import { CRUD } from "Components/CRUD";

const columns: GridColumns = [
	{ field: "siape", headerName: "SIAPE", flex: 1 },
	{ field: "nome", headerName: "Nome", flex: 2 },
	{ field: "email", headerName: "E-mail", flex: 3 },
	{
		field: "tipo_professor",
		headerName: "Tipo",
		flex: 1,
		valueGetter: ({ row }: { row: AdvisorListResponse }) =>
			capitalize(row.tipo_professor),
	},
	{
		field: "created_at",
		headerName: "Criado em",
		flex: 1,
		valueGetter: ({ row }: { row: AdvisorListResponse }) =>
			dayjs(row.created_at).format("DD/MM/YYYY HH:mm"),
	},
];

export const Advisors = () => (
	<PageContainer title="Professores">
		<CRUD<Array<AdvisorListResponse>>
			title="Professores"
			renderAdd={() => "Cadastrar novo professor"}
			initialData={[]}
			getDataService={client.advisor.list}
			getRows={(data) => data}
			columns={columns}
			tableProps={{
				getRowId: (row) => row.siape,
			}}
			renderForm={(dialogOpen, handleDialog) => (
				<NewAdvisor
					dialogOpen={dialogOpen}
					handleDialog={handleDialog}
				/>
			)}
		/>
	</PageContainer>
);
