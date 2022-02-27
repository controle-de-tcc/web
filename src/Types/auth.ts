export enum UserRoles {
	Student = "student",
	Advisor = "advisor",
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
	userType: UserRoles;
	user: UserData;
};
