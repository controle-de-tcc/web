import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { LoginResponse } from "Services/auth";

type AuthData = {
	token: string;
	userType: "student";
	user: {
		matricula: number;
		nome: string;
		email: string;
	};
};

type AuthContextData = {
	auth: AuthData | null;
	updateAuth(auth: LoginResponse): void;
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
			console.log("firstRender", savedAuth);
			if (savedAuth) {
				const newAuth = JSON.parse(savedAuth);
				setAuth(newAuth);
				firstRender.current = false;
			}
		}
	}, []);

	const updateAuth = (loginResponse: LoginResponse) => {
		const newAuth: AuthData = {
			token: loginResponse.token,
			userType: loginResponse.userType,
			user: {
				matricula: loginResponse.user.matricula,
				nome: loginResponse.user.nome,
				email: loginResponse.user.email,
			},
		};
		setAuth(newAuth);
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
