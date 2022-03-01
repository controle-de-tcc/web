import { api } from "Services/axiosConfig";
import { UserData, UserRoles } from "Types/auth";

export type LoginResponse = {
	token: string;
	user_type: UserRoles;
	user: UserData;
};

export const auth = {
	async login(email: string, senha: string): Promise<LoginResponse> {
		const { data } = await api.post("/auth/login", {
			email,
			senha,
		});

		return data;
	},
};
