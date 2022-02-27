import { api } from "Services/axiosConfig";
import { AdvisorData } from "Types/advisor";
import { StudentData } from "Types/student";

export type ProjectCreateBody = {
	titulo: string;
	mat_aluno: number;
	siape_orientador: number;
	avaliadores: number[];
};

export type ProjectListResponse = {
	id: string;
	titulo: string;
	aluno: StudentData;
	orientador: AdvisorData;
	avaliadores: { avaliador: AdvisorData }[];
	created_at: Date;
	updated_at: Date;
};

export const project = {
	async create(body: ProjectCreateBody): Promise<void> {
		return api.post("/projeto", body);
	},

	async list(): Promise<Array<ProjectListResponse>> {
		const { data } = await api.get("/projeto");

		return data;
	},
};
