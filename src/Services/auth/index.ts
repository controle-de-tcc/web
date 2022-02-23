import { api } from "Services/axiosConfig";

export type LoginResponse = {
	token: string;
	userType: "student";
	user: {
		matricula: number;
		nome: string;
		email: string;
	};
};

export const auth = {
	async login(email: string, password: string): Promise<LoginResponse> {
		const { data } = await api.post("/auth/login", {
			email,
			password,
		});

		return data;
	},
};
