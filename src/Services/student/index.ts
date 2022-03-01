import { api } from "Services/axiosConfig";

export type StudentCreateBody = {
	matricula: number;
	email: string;
	nome: string;
	senha: string;
};

export type StudentListResponse = {
	matricula: number;
	nome: string;
	email: string;
	created_at: Date;
	updatedAt: Date;
};

export const student = {
	async create(body: StudentCreateBody): Promise<void> {
		return api.post("/aluno", body);
	},

	async list(): Promise<Array<StudentListResponse>> {
		const { data } = await api.get("/aluno");

		return data;
	},

	async delete(ids: Array<number>): Promise<void> {
		return api.delete("/aluno", { data: { ids } });
	},
};
