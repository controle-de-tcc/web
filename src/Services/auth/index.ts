import { api } from "Services/axiosConfig";
import { UserData, UserRoles } from "Types/auth";

export type LoginResponse = {
	token: string;
	userType: UserRoles;
	user: UserData;
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
