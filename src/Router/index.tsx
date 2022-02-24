import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Login } from "Pages/Login";
import { Dashboard } from "Pages/Dashboard";
import { useAuth } from "Hooks/useAuth";
import { Sidebar } from "Components/Sidebar";

export const Router = () => {
	const { auth } = useAuth();

	const guardRoute = (
		auth: boolean,
		element: JSX.Element,
		to = "/login"
	): JSX.Element => {
		if (auth) {
			return element;
		}
		return <Navigate to={to} />;
	};

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/login"
					element={guardRoute(
						!Boolean(auth),
						<Login />,
						"/dashboard"
					)}
				/>
				<Route
					path="/dashboard"
					element={guardRoute(Boolean(auth), <Dashboard />)}
				/>
				<Route path="*" element={<Navigate to="/login" />} />
			</Routes>
		</BrowserRouter>
	);
};
