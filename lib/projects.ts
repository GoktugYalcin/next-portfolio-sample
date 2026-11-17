import { projects } from "@/data/portfolio";
import { PortfolioProject } from "@/types/portfolio";

/** Projects from data/portfolio.ts: the finished ones, or the ones in progress. */
export const getProjects = async (
  currently: boolean
): Promise<PortfolioProject[]> =>
  projects.filter((p) => p.currently === currently);
