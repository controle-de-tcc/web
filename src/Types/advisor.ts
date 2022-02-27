import { AdvisorRoles } from "./auth";

export type AdvisorData = {
	siape: number;
	email: string;
	nome: string;
	tipo_professor: AdvisorRoles;
};
