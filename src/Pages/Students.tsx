import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { NewStudent } from "Components/NewStudent";
import { PageContainer } from "Components/PageContainer";
import { useSnackbar } from "Hooks/useSnackbar";
import { useCallback, useEffect, useState } from "react";
import { client } from "Services";
import { StudentListResponse } from "Services/student";
import dayjs from "dayjs";
import { Table } from "Components/Table";

const columns: GridColumns = [
	{ field: "matricula", headerName: "Matrícula", flex: 1 },
	{ field: "nome", headerName: "Nome", flex: 2 },
	{ field: "email", headerName: "E-mail", flex: 3 },
	{
		field: "createdAt",
		headerName: "Criado em",
		flex: 1,
		valueGetter: ({ row }: { row: StudentListResponse }) =>
			dayjs(row.createdAt).format("DD/MM/YYYY HH:mm"),
	},
];

export const Students = () => {
	const { toggleSnackbar } = useSnackbar();

	const [students, setStudents] = useState<Array<StudentListResponse>>([]);
	const [dialogOpen, setDialogOpen] = useState(false);

	const listStudents = useCallback(() => {
		client.student
			.list()
			.then((res) => {
				setStudents(res);
			})
			.catch((err) => {
				const msg =
					err.response?.data.msg ??
					"Algo deu errado, tente novamente";
				toggleSnackbar(msg);
			});
	}, [toggleSnackbar]);

	useEffect(() => {
		listStudents();
	}, [listStudents]);

	const handleDialog = useCallback(
		(value: boolean, update = false) => {
			setDialogOpen(value);
			if (update) {
				listStudents();
			}
		},
		[listStudents]
	);

	return (
		<PageContainer title="Alunos">
			<Typography
				variant="h4"
				color="primary.main"
				fontWeight="500"
				sx={{ marginBottom: "16px" }}
			>
				Alunos
			</Typography>
			<Button
				type="button"
				onClick={() => setDialogOpen(true)}
				variant="contained"
				color="primary"
			>
				<Add sx={{ marginRight: "8px" }} />
				Cadastrar novo aluno
			</Button>
			<Table
				rows={students}
				columns={columns}
				getRowId={(row) => row.matricula}
			/>
			{/* Isso é um dialog */}
			<NewStudent dialogOpen={dialogOpen} handleDialog={handleDialog} />
		</PageContainer>
	);
};
