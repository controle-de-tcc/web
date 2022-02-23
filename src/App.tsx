import { ThemeProvider } from "@mui/material";
import { AuthContextProvider } from "Context/Auth.context";
import { SnackbarContextProvider } from "Context/Snackbar.context";
import { Router } from "Router";
import { theme } from "Theme";

export const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<SnackbarContextProvider>
				<AuthContextProvider>
					<Router />
				</AuthContextProvider>
			</SnackbarContextProvider>
		</ThemeProvider>
	);
};
