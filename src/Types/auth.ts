export enum UserRoles {
	Student = "student",
	Advisor = "advisor",
}

export enum AdvisorRoles {
	Advisor = "orientador",
	Reviewer = "avaliador",
}

export type UserData = {
	matricula: number;
	nome: string;
	email: string;
	tipoProfessor?: AdvisorRoles;
};
