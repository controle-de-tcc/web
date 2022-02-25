import { Add } from "@mui/icons-material";
import {
	Button,
	Card,
	Divider,
	List,
	ListItem,
	Typography,
} from "@mui/material";
import { NewProject } from "Components/NewProject";
import { PageContainer } from "Components/PageContainer";
import { useSnackbar } from "Hooks/useSnackbar";
import { useEffect, useState } from "react";
import { client } from "Services";
import { ProjectData } from "Types/project";

export const Projects = () => {
	const { toggleSnackbar } = useSnackbar();

	const [projects, setProjects] = useState<Array<ProjectData>>([]);
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		client.project
			.list()
			.then((res) => {
				setProjects(res);
			})
			.catch((err) => {
				const msg =
					err.response?.data.msg ??
					"Algo deu errado, tente novamente";
				toggleSnackbar(msg);
			});
	}, [toggleSnackbar]);

	return (
		<PageContainer title="Projetos">
			<Typography
				variant="h4"
				color="primary.main"
				fontWeight="500"
				sx={{ marginBottom: "16px" }}
			>
				Projetos
			</Typography>
			<Button
				type="button"
				onClick={() => setDialogOpen(true)}
				variant="contained"
				color="primary"
			>
				<Add sx={{ marginRight: "8px" }} />
				Cadastrar novo projeto
			</Button>
			<List>
				{projects.map((project, index) => (
					<>
						<ListItem key={project.id}>
							<Card>
								<Typography variant="h5" color="primary.main">
									<strong>{index + 1}.</strong>{" "}
									{project.titulo}
								</Typography>
							</Card>
						</ListItem>
						<Divider />
					</>
				))}
			</List>

			{/* Isso é um dialog */}
			<NewProject dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
		</PageContainer>
	);
};
