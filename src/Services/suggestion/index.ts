import { api } from "Services/axiosConfig";

export type SuggestionCreateBody = {
	siape_professor: number;
	texto: string;
	arquivo: File;
};

export const suggestion = {
	async create(id_versao: number, body: SuggestionCreateBody): Promise<void> {
		const formData = new FormData();
		formData.append("siape_professor", String(body.siape_professor));
		formData.append("texto", body.texto);
		formData.append("arquivo", body.arquivo);

		return api.post(`/sugestao/${id_versao}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},

	async delete(ids: Array<number>): Promise<void> {
		return api.delete("/sugestao", { data: { ids } });
	},
};
