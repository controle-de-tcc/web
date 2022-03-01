import { api } from "Services/axiosConfig";
import { AdvisorRoles } from "Types/auth";

export type AdvisorCreateBody = {
	email: string;
	nome: string;
	senha: string;
	siape: number;
	tipo_professor: AdvisorRoles;
};

export type AdvisorListResponse = {
	siape: number;
	email: string;
	nome: string;
	tipo_professor: AdvisorRoles;
	created_at: Date;
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

	async delete(ids: Array<number>): Promise<void> {
		return api.delete("/orientador", { data: { ids } });
	},
};
