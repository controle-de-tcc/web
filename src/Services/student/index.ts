import { api } from "Services/axiosConfig";

export type StudentListResponse = {
	matricula: number;
	nome: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
};

export const student = {
	async list(): Promise<Array<StudentListResponse>> {
		const { data } = await api.get("/aluno");

		return data;
	},
};
