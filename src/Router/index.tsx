import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Login } from "Pages/Login";
import { Home } from "Pages/Home";
import { Projects } from "Pages/Projects";
import { Advisors } from "Pages/Advisors";
import { Students } from "Pages/Students";
import { ProjectDetails } from "Pages/ProjectDetails";
import { useAuth } from "Hooks/useAuth";
import { Locations } from "Types/routes";
import { AdvisorRoles, UserRoles } from "Types/auth";
import { ProjectVersion } from "Pages/ProjectVersion";

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

	const isAdvisor = Boolean(
		auth && auth.user?.tipo_professor === AdvisorRoles.Advisor
	);

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
					element={guardRoute(
						auth?.userType === UserRoles.Professor,
						<Projects isAdvisor={isAdvisor} />
					)}
				/>
				<Route
					path={Locations.ProjectDetails}
					element={guardRoute(Boolean(auth), <ProjectDetails />)}
				/>
				<Route
					path={Locations.ProjectVersion}
					element={guardRoute(Boolean(auth), <ProjectVersion />)}
				/>
				<Route
					path={Locations.Advisors}
					element={guardRoute(isAdvisor, <Advisors />)}
				/>
				<Route
					path={Locations.Students}
					element={guardRoute(isAdvisor, <Students />)}
				/>
				<Route path="*" element={<Navigate to={Locations.Login} />} />
			</Routes>
		</BrowserRouter>
	);
};
