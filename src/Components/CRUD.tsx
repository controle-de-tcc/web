import { Add, DeleteOutline } from "@mui/icons-material";
import { Box, Button, Fade, Paper, Typography } from "@mui/material";
import { DataGrid, DataGridProps, GridColumns, ptBR } from "@mui/x-data-grid";
import { useSnackbar } from "Hooks/useSnackbar";
import { useCallback, useEffect, useState } from "react";
import { BaseDialog } from "./BaseDialog";

type CRUDProps<DataType> = {
	title: string;
	renderAdd(data: DataType): string | null;
	onDelete?(ids: Array<number>): Promise<void>;
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
	onDelete,
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
	const [selected, setSelected] = useState<Array<any>>([]);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
				<Box sx={{ display: "flex", gap: "16px" }}>
					<Button
						type="button"
						onClick={() => setDialogOpen(true)}
						variant="contained"
						color="primary"
					>
						<Add sx={{ marginRight: "8px" }} />
						{renderAdd(data)}
					</Button>
					<Fade in={selected.length > 0}>
						<Button
							type="button"
							onClick={() => setDeleteDialogOpen(true)}
							variant="contained"
							color="error"
						>
							<DeleteOutline sx={{ marginRight: "8px" }} />
							Remover registros selecionados
						</Button>
					</Fade>
				</Box>
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
					onSelectionModelChange={setSelected}
					disableSelectionOnClick
					{...tableProps}
				/>
			</Paper>
			{renderForm(dialogOpen, handleDialog, data)}
			{/* Diálogo de remoção */}
			<BaseDialog
				open={deleteDialogOpen}
				onCancel={() => setDeleteDialogOpen(false)}
				onConfirm={() => {
					if (onDelete) {
						onDelete(selected).finally(() => {
							getData();
							setDeleteDialogOpen(false);
						});
					}
				}}
				text="Tem certeza que deseja remover os registros selecionados?"
				confirmText="Confirmar"
			/>
		</>
	);
};
