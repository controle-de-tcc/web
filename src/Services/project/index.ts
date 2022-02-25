import { api } from "Services/axiosConfig";

export type ProjectCreateBody = {
	titulo: string;
	mat_aluno: number;
};

export type ProjectListResponse = {
	id: string;
	titulo: string;
	mat_aluno: number;
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
