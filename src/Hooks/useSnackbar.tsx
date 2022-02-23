import { useContext } from "react";
import { SnackbarContext } from "Context/Snackbar.context";

export const useSnackbar = () => {
	const snackbarContext = useContext(SnackbarContext);

	return { ...snackbarContext };
};
