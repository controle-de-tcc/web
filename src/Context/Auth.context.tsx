import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { LoginResponse } from "Services/auth";
import { UserData, UserRoles } from "Types/auth";

type AuthData = {
	token: string;
	userType: UserRoles;
	user: UserData;
};

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
				setAuth(newAuth);
				firstRender.current = false;
			}
		}
	}, []);

	const updateAuth = (data: LoginResponse | null) => {
		if (data === null) {
			localStorage.removeItem("auth");
			setAuth(null);
			return;
		}
		const newAuth: AuthData = {
			token: data.token,
			userType: data.userType,
			user: {
				matricula: data.user.matricula,
				nome: data.user.nome,
				email: data.user.email,
			},
		};
		if (newAuth.userType === UserRoles.Advisor) {
			newAuth.user.tipoProfessor = data.user.tipoProfessor;
		}
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
