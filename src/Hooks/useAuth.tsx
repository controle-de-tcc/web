import { AuthContext } from "Context/Auth.context";
import { useContext } from "react";

export const useAuth = () => {
	const authContext = useContext(AuthContext);

	return { ...authContext };
};
