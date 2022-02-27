import { Paper } from "@mui/material";
import { DataGrid, DataGridProps, ptBR } from "@mui/x-data-grid";

export const Table = (props: DataGridProps) => {
	return (
		<Paper sx={{ height: "80vh", marginTop: "16px" }}>
			<DataGrid
				localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
				pageSize={5}
				rowsPerPageOptions={[5]}
				{...props}
			/>
		</Paper>
	);
};
