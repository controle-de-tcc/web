import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { LoginResponse } from "Services/auth";
import { api } from "Services/axiosConfig";
import { AuthData } from "Types/auth";

type AuthContextData = {
	auth: AuthData | null;
	updateAuth(auth: LoginResponse | null): void;
};

export const AuthContext = createContext<AuthContextData>({
	auth: null,
	updateAuth() {},
});

export const AuthContextProvider: React.FC = ({ children }) => {
	const [auth, setAuth] = useState<AuthData | null>(null);

	const firstRender = useRef(true);

	useEffect(() => {
		if (firstRender.current) {
			const savedAuth = localStorage.getItem("auth");
			if (savedAuth) {
				const newAuth = JSON.parse(savedAuth);
				api.defaults.headers.common[
					"Authorization"
				] = `Bearer ${newAuth.token}`;
				setAuth(newAuth);
				firstRender.current = false;
			}
		}
	}, []);

	const updateAuth = (data: LoginResponse | null) => {
		if (data === null) {
			localStorage.removeItem("auth");
			delete api.defaults.headers.common["Authorization"];
			setAuth(null);
			return;
		}
		const newAuth: AuthData = {
			token: data.token,
			user_type: data.user_type,
			user:
				"siape" in data.user
					? {
							siape: data.user.siape,
							nome: data.user.nome,
							email: data.user.email,
							tipo_professor: data.user.tipo_professor,
					  }
					: {
							matricula: data.user.matricula,
							nome: data.user.nome,
							email: data.user.email,
					  },
		};
		setAuth(newAuth);
		api.defaults.headers.common[
			"Authorization"
		] = `Bearer ${newAuth.token}`;
		localStorage.setItem("auth", JSON.stringify(newAuth));
	};

	const value = useMemo(
		(): AuthContextData => ({
			auth,
			updateAuth,
		}),
		[auth]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
