import { createContext, useMemo, useState } from "react";
import { LoginResponse } from "Services/auth";

type AuthContextData = {
	auth: LoginResponse | null;
	setAuth(auth: LoginResponse): void;
};

export const AuthContext = createContext<AuthContextData>({
	auth: null,
	setAuth() {},
});

export const AuthContextProvider: React.FC = ({ children }) => {
	const [auth, setAuth] = useState<LoginResponse | null>(null);

	const value = useMemo(
		(): AuthContextData => ({
			auth,
			setAuth,
		}),
		[auth]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
