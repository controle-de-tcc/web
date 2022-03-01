import { Add } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { DataGrid, DataGridProps, GridColumns, ptBR } from "@mui/x-data-grid";
import { useSnackbar } from "Hooks/useSnackbar";
import { useCallback, useEffect, useState } from "react";

type CRUDProps<DataType> = {
	title: string;
	renderAdd(data: DataType): string | null;
	renderBody?(data: DataType): JSX.Element;
	initialData: DataType;
	getDataService(): Promise<DataType>;
	getRows(data: DataType): Array<any>;
	columns: GridColumns;
	tableProps?: Omit<DataGridProps, "rows" | "columns">;
	renderForm(
		dialogOpen: boolean,
		handleDialog: (value: boolean, update?: boolean) => void,
		data: DataType
	): JSX.Element;
};

export const CRUD = <DataType extends any>({
	title,
	renderAdd,
	renderBody,
	initialData,
	getDataService,
	columns,
	getRows,
	tableProps,
	renderForm,
}: CRUDProps<DataType>) => {
	const { toggleSnackbar } = useSnackbar();

	const [data, setData] = useState<DataType>(initialData);
	const [dialogOpen, setDialogOpen] = useState(false);

	const getData = useCallback(() => {
		getDataService()
			.then((res) => {
				setData(res);
			})
			.catch((err) => {
				const msg =
					err.response?.data.msg ??
					"Algo deu errado, tente novamente";
				toggleSnackbar(msg);
			});
	}, [getDataService, toggleSnackbar]);

	useEffect(() => {
		getData();
	}, [getData]);

	const handleDialog = useCallback(
		(value: boolean, update = false) => {
			setDialogOpen(value);
			if (update) {
				getData();
			}
		},
		[getData]
	);

	return (
		<>
			<Typography
				variant="h4"
				color="primary.main"
				fontWeight="500"
				sx={{ marginBottom: "16px" }}
			>
				{title}
			</Typography>
			{renderBody && renderBody(data)}
			{renderAdd(data) && (
				<Button
					type="button"
					onClick={() => setDialogOpen(true)}
					variant="contained"
					color="primary"
				>
					<Add sx={{ marginRight: "8px" }} />
					{renderAdd(data)}
				</Button>
			)}
			<Paper sx={{ height: "80vh", marginTop: "16px" }}>
				<DataGrid
					localeText={
						ptBR.components.MuiDataGrid.defaultProps.localeText
					}
					pageSize={5}
					rowsPerPageOptions={[5]}
					columns={columns}
					rows={getRows(data)}
					checkboxSelection
					onSelectionModelChange={(selected) => {
						console.log(selected);
					}}
					disableSelectionOnClick
					{...tableProps}
				/>
			</Paper>
			{renderForm(dialogOpen, handleDialog, data)}
		</>
	);
};
