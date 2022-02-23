import { Snackbar } from "@mui/material";
import { createContext, useMemo, useState } from "react";

type SnackbarContextData = {
	toggleSnackbar(message: string): void;
};

export const SnackbarContext = createContext<SnackbarContextData>({
	toggleSnackbar() {},
});

export const SnackbarContextProvider: React.FC = ({ children }) => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");

	const toggleSnackbar = (message: string): void => {
		setOpen(true);
		setMessage(message);
	};

	const handleClose = (_: any, reason: string) => {
		if (reason === "clickaway") return;

		setOpen(false);
	};

	const value = useMemo(
		(): SnackbarContextData => ({
			toggleSnackbar,
		}),
		[]
	);

	return (
		<SnackbarContext.Provider value={value}>
			{children}
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				message={message}
			/>
		</SnackbarContext.Provider>
	);
};
