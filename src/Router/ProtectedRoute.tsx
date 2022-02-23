import { Route, Navigate, RouteProps } from "react-router-dom";

type ProtectedRouteProps = RouteProps & {
	auth: boolean;
};

export const ProtectedRoute = ({ auth, ...props }: ProtectedRouteProps) => (
	<Route {...props} element={auth ? props.element : <Navigate to="/" />} />
);
