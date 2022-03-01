import { api } from "Services/axiosConfig";
import { AdvisorData } from "Types/advisor";
import { VersionData } from "Types/project";
import { StudentData } from "Types/student";

export type ProjectCreateBody = {
	titulo: string;
	mat_aluno: number;
	siape_orientador: number;
	avaliadores: number[];
};

export type ProjectListResponse = {
	id: number;
	titulo: string;
	aluno: StudentData;
	orientador: AdvisorData;
	avaliadores: Array<{ avaliador: AdvisorData }>;
	created_at: Date;
	updated_at: Date;
};

export type ProjectGetResponse = ProjectListResponse & {
	versoes: Array<VersionData>;
};

export const project = {
	async create(body: ProjectCreateBody): Promise<void> {
		return api.post("/projeto", body);
	},

	async list(siape?: number): Promise<Array<ProjectListResponse>> {
		let url = "/projeto";
		if (siape) url += `/por-avaliador/${siape}`;
		const { data } = await api.get(url);
		return data;
	},

	async getByStudent(mat_aluno: number): Promise<ProjectGetResponse> {
		const { data } = await api.get(`/projeto/por-aluno/${mat_aluno}`);
		return data;
	},

	async delete(ids: Array<number>): Promise<void> {
		return api.delete("/projeto", { data: { ids } });
	},
};
