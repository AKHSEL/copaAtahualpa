import { prisma } from "./prisma";

export async function getActiveSeason() {
  const season = await prisma.season.findFirst({ where: { active: true } });
  if (!season) throw new Error("No hay una temporada activa.");
  return season;
}
