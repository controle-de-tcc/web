import { GridColumns } from "@mui/x-data-grid";
import { NewStudent } from "Components/NewStudent";
import { PageContainer } from "Components/PageContainer";
import { client } from "Services";
import { StudentListResponse } from "Services/student";
import dayjs from "dayjs";
import { CRUD } from "Components/CRUD";

const columns: GridColumns = [
	{ field: "matricula", headerName: "Matrícula", flex: 1 },
	{ field: "nome", headerName: "Nome", flex: 2 },
	{ field: "email", headerName: "E-mail", flex: 3 },
	{
		field: "created_at",
		headerName: "Criado em",
		flex: 1,
		valueGetter: ({ row }: { row: StudentListResponse }) =>
			dayjs(row.created_at).format("DD/MM/YYYY HH:mm"),
	},
];

export const Students = () => (
	<PageContainer title="Alunos">
		<CRUD<Array<StudentListResponse>>
			title="Alunos"
			renderAdd={() => "Cadastrar novo aluno"}
			initialData={[]}
			getDataService={client.student.list}
			getRows={(data) => data}
			columns={columns}
			tableProps={{
				getRowId: (row) => row.matricula,
			}}
			renderForm={(dialogOpen, handleDialog) => (
				<NewStudent
					dialogOpen={dialogOpen}
					handleDialog={handleDialog}
				/>
			)}
		/>
	</PageContainer>
);
