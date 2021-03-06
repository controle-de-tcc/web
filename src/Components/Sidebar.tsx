import {
	Avatar,
	Box,
	Icon,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	useTheme,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useAuth } from "Hooks/useAuth";
import { FilePresent, Home, Logout, Person, School } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { getOpaque } from "Lib/helpers";
import { AdvisorRoles, AuthData, UserRoles } from "Types/auth";
import { Locations } from "Types/routes";

const SIDEBAR_WIDTH = 280;

const routes = [
	{
		icon: <Home />,
		label: "Início",
		to: Locations.Home,
	},
	{
		icon: <FilePresent />,
		label: "Projetos",
		to: Locations.Projects,
		hasPermissions: (auth: AuthData) =>
			auth.user_type === UserRoles.Professor,
	},
	{
		icon: <FilePresent />,
		label: "Meu projeto",
		to: (mat_aluno: number) =>
			Locations.ProjectDetails.replace(
				":mat_aluno",
				mat_aluno.toString()
			),
		hasPermissions: (auth: AuthData) =>
			auth.user_type === UserRoles.Student,
	},
	{
		icon: <Person />,
		label: "Profesores",
		to: Locations.Advisors,
		hasPermissions: (auth: AuthData) =>
			auth.user?.tipo_professor === AdvisorRoles.Advisor,
	},
	{
		icon: <School />,
		label: "Alunos",
		to: Locations.Students,
		hasPermissions: (auth: AuthData) =>
			auth.user?.tipo_professor === AdvisorRoles.Advisor,
	},
];

export const Sidebar = () => {
	const theme = useTheme();
	const { auth, updateAuth } = useAuth();
	const location = useLocation();

	return (
		<Drawer
			variant="permanent"
			sx={{
				display: { xs: "none", sm: "block" },
				"& .MuiDrawer-paper": {
					boxSizing: "border-box",
					width: SIDEBAR_WIDTH,
					backgroundColor: getOpaque("80"),
					padding: "16px",
				},
			}}
			open
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: "16px",
				}}
			>
				<Avatar
					sx={{ width: 64, height: 64, border: "4px solid white" }}
				/>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
					}}
				>
					<Typography
						fontSize="24px"
						color="white"
						fontWeight="medium"
						lineHeight={1.15}
					>
						{auth?.user.nome}
					</Typography>
					<Typography
						fontSize="20px"
						color="white"
						fontWeight="light"
						lineHeight={1.15}
					>
						{auth?.user_type === UserRoles.Student
							? "Aluno"
							: auth?.user.tipo_professor === AdvisorRoles.Advisor
							? "Orientador"
							: "Avaliador"}
					</Typography>
				</Box>
			</Box>
			<List
				sx={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: "16px",
					marginTop: "16px",
				}}
			>
				{routes.map((route) => {
					const to =
						typeof route.to === "function"
							? route.to(Number(auth?.user?.matricula))
							: route.to;
					return (
						(!route?.hasPermissions ||
							(auth && route.hasPermissions(auth))) && (
							<Link
								key={to}
								to={to}
								style={{ textDecoration: "none" }}
							>
								<ListItem
									button
									sx={{
										padding: "0 8px",
										height: "48px",
										borderRadius: theme.spacing(1.25),
										backgroundColor:
											location.pathname === to
												? getOpaque("80")
												: "transparent",
									}}
								>
									<ListItemIcon
										color="white"
										sx={{ minWidth: 0, marginRight: "8px" }}
									>
										<Icon sx={{ color: "white" }}>
											{route.icon}
										</Icon>
									</ListItemIcon>
									<ListItemText
										primary={route.label}
										primaryTypographyProps={{
											fontSize: "20px",
											color: "white",
										}}
									/>
								</ListItem>
							</Link>
						)
					);
				})}
			</List>
			<ListItem
				button
				onClick={() => updateAuth(null)}
				sx={{
					padding: "0 8px",
					height: "48px",
					borderRadius: theme.spacing(1.25),
					backgroundColor: "#5700001A",
				}}
			>
				<ListItemIcon
					color="white"
					sx={{ minWidth: 0, marginRight: "8px" }}
				>
					<Icon sx={{ color: "white" }}>
						<Logout />
					</Icon>
				</ListItemIcon>
				<ListItemText
					primary="Sair"
					primaryTypographyProps={{
						fontSize: "20px",
						color: "white",
					}}
				/>
			</ListItem>
		</Drawer>
	);
};
