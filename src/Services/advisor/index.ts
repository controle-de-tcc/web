import { api } from "Services/axiosConfig";
import { AdvisorRoles } from "Types/auth";

export type AdvisorCreateBody = {
	email: string;
	nome: string;
	senha: string;
	siape: number;
	tipoProfessor: AdvisorRoles;
};

export type AdvisorListResponse = {
	siape: number;
	email: string;
	nome: string;
	tipoProfessor: AdvisorRoles;
	createdAt: Date;
	updatedAt: Date;
};

export const advisor = {
	async create(body: AdvisorCreateBody): Promise<void> {
		return api.post("/orientador", body);
	},

	async list(): Promise<Array<AdvisorListResponse>> {
		const { data } = await api.get("/orientador");

		return data;
	},
};
