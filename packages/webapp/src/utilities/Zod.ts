import { z } from "zod"

export const playerClassNameZod = z.enum(["Working Class", "Middle Class", "Capitalist Class", "State"])

export const tabNameZod = z.enum(["All classes", ...playerClassNameZod.options, "Policies", "Voting Bag", "Marketplace"])