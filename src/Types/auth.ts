export enum UserRoles {
	Student = "aluno",
	Professor = "professor",
}

export enum AdvisorRoles {
	Advisor = "orientador",
	Reviewer = "avaliador",
}

export type UserData = {
	matricula?: number;
	siape?: number;
	nome: string;
	email: string;
	tipo_professor?: AdvisorRoles;
};

export type AuthData = {
	token: string;
	user_type: UserRoles;
	user: UserData;
};
