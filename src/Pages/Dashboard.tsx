import { Typography } from "@mui/material";
import { PageContainer } from "Components/PageContainer";

export const Dashboard = () => {
	return (
		<PageContainer title="Início">
			<Typography variant="h4" color="primary.main" fontWeight="500">
				Bem-vindo ao sistema de controle de TCC!
			</Typography>
			<Typography
				variant="h6"
				color="black"
				fontWeight="light"
				sx={{ marginTop: "16px" }}
			>
				Use as abas ao lado para navegar
			</Typography>
		</PageContainer>
	);
};
