import { theme } from "Theme";

export const getOpaque = (percent: string) =>
	theme.palette.primary.main + percent;
