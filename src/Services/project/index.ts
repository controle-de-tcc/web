import { api } from "Services/axiosConfig";
import { StudentData } from "Types/student";

export type ProjectCreateBody = {
	titulo: string;
	mat_aluno: number;
};

export type ProjectListResponse = {
	id: string;
	titulo: string;
	aluno: StudentData;
	createdAt: Date;
	updatedAt: Date;
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
