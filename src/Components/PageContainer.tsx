import { Box } from "@mui/material";
import { Helmet } from "react-helmet";
import { getOpaque } from "Lib/helpers";
import { Sidebar } from "./Sidebar";

type PageContainerProps = {
	title: string;
};

export const PageContainer: React.FC<PageContainerProps> = ({
	title,
	children,
}) => {
	return (
		<>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			<Sidebar />
			<Box
				sx={{
					padding: "16px",
					marginLeft: "280px",
					height: "100vh",
					backgroundColor: getOpaque("40"),
				}}
			>
				{children}
			</Box>
		</>
	);
};
