import { AdvisorData } from "./advisor";

export type ProjectData = {
	id: number;
	titulo: string;
	mat_aluno: number;
};

export type VersionData = {
	id: number;
	id_projeto: number;
	arquivo: string;
	created_at: Date;
	updated_at: Date;
};

export type SuggestionData = {
	id: number;
	id_versao: number;
	siape_professor: number;
	professor: AdvisorData;
	arquivo: string;
	texto: string;
	created_at: Date;
	updated_at: Date;
};
