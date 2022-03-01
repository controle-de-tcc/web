import { api } from "Services/axiosConfig";
import { AdvisorData } from "Types/advisor";
import { SuggestionData, VersionData } from "Types/project";
import { StudentData } from "Types/student";

export type ProjectCreateBody = {
	titulo: string;
	mat_aluno: number;
	siape_orientador: number;
	avaliadores: number[];
};

export type ProjectListResponse = {
	id: number;
	titulo: string;
	aluno: StudentData;
	orientador: AdvisorData;
	avaliadores: Array<{ avaliador: AdvisorData }>;
	created_at: Date;
	updated_at: Date;
};

export type ProjectGetResponse = ProjectListResponse & {
	versoes: Array<VersionData>;
};

export type ProjectVersionGetResponse = VersionData & {
	projeto: ProjectListResponse;
	sugestoes: Array<SuggestionData>;
};

export type SuggestionCreateBody = {
	siape_professor: number;
	texto: string;
	arquivo: File;
};

export const project = {
	async create(body: ProjectCreateBody): Promise<void> {
		return api.post("/projeto", body);
	},

	async list(siape?: number): Promise<Array<ProjectListResponse>> {
		let url = "/projeto";
		if (siape) url += `/por-avaliador/${siape}`;
		const { data } = await api.get(url);
		return data;
	},

	async getByStudent(mat_aluno: number): Promise<ProjectGetResponse> {
		const { data } = await api.get(`/projeto/por-aluno/${mat_aluno}`);
		return data;
	},

	async createVersion(id_projeto: number, arquivo: File): Promise<void> {
		const formData = new FormData();
		formData.append("arquivo", arquivo);
		return api.post(`/projeto/${id_projeto}/nova-versao`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},

	async getByVersion(id_versao: number): Promise<ProjectVersionGetResponse> {
		const { data } = await api.get(`/projeto/por-versao/${id_versao}`);
		return data;
	},

	async createSuggestion(
		id_versao: number,
		body: SuggestionCreateBody
	): Promise<void> {
		const formData = new FormData();
		formData.append("siape_professor", String(body.siape_professor));
		formData.append("texto", body.texto);
		formData.append("arquivo", body.arquivo);
		return api.post(
			`/projeto/versao/${id_versao}/nova-sugestao`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
	},

	async delete(ids: Array<number>): Promise<void> {
		return api.delete("/projeto", { data: { ids } });
	},
};
