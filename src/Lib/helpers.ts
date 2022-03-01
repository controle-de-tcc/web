import { theme } from "Theme";
import { AdvisorData } from "Types/advisor";

export const getOpaque = (percent: string) =>
	theme.palette.primary.main + percent;

export const formatReviewers = (
	avaliadores: Array<{ avaliador: AdvisorData }>
) => {
	return avaliadores
		.map((x) => x.avaliador.nome)
		.reduce(
			(acc, cur, idx) =>
				(acc += cur + (idx < avaliadores.length - 1 ? ", " : "")),
			""
		);
};
