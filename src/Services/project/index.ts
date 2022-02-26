import { api } from "Services/axiosConfig";
import { UserData } from "Types/auth";
import { ProjectData } from "Types/project";

export type ProjectCreateBody = {
	titulo: string;
	mat_aluno: number;
};

export type ProjectListResponse = {
	id: ProjectData["id"];
	titulo: ProjectData["titulo"];
	aluno: Omit<UserData, "tipoProfessor">;
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
