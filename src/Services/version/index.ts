import { api } from "Services/axiosConfig";
import { ProjectListResponse } from "Services/project";
import { SuggestionData, VersionData } from "Types/project";

export type VersionGetResponse = VersionData & {
	projeto: ProjectListResponse;
	sugestoes: Array<SuggestionData>;
};

export const version = {
	async create(id_projeto: number, arquivo: File): Promise<void> {
		const formData = new FormData();
		formData.append("arquivo", arquivo);

		return api.post(`/versao/${id_projeto}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},

	async get(id_versao: number): Promise<VersionGetResponse> {
		const { data } = await api.get(`/versao/${id_versao}`);

		return data;
	},

	async delete(ids: Array<number>): Promise<void> {
		return api.delete("/versao", { data: { ids } });
	},
};
