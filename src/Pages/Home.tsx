import { Typography } from "@mui/material";
import { PageContainer } from "Components/PageContainer";

export const Home = () => {
	return (
		<PageContainer title="Início">
			<Typography
				variant="h4"
				color="primary.main"
				fontWeight="500"
				sx={{ marginBottom: "16px" }}
			>
				Bem-vindo ao sistema de controle de TCC!
			</Typography>
			<Typography variant="h6" color="black" fontWeight="light">
				Use as abas ao lado para navegar
			</Typography>
		</PageContainer>
	);
};
