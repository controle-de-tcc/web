import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Login } from "Pages/Login";
import { Dashboard } from "Pages/Dashboard";
import { useAuth } from "Hooks/useAuth";

export const Router = () => {
	const { auth } = useAuth();

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route
					path="/dashboard"
					element={auth ? <Dashboard /> : <Navigate to="/login" />}
				/>
				<Route path="*" element={<Navigate to="/login" />} />
			</Routes>
		</BrowserRouter>
	);
};
