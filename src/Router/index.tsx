import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Login } from "Pages/Login";
import { Home } from "Pages/Home";
import { Projects } from "Pages/Projects";
import { useAuth } from "Hooks/useAuth";
import { Locations } from "Types/routes";

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
					path={Locations.Login}
					element={guardRoute(
						!Boolean(auth),
						<Login />,
						Locations.Home
					)}
				/>
				<Route
					path={Locations.Home}
					element={guardRoute(Boolean(auth), <Home />)}
				/>
				<Route
					path={Locations.Projects}
					element={guardRoute(Boolean(auth), <Projects />)}
				/>
				<Route path="*" element={<Navigate to={Locations.Login} />} />
			</Routes>
		</BrowserRouter>
	);
};
