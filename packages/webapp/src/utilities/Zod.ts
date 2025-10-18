import { z } from "zod"

export const playerClassNameZod = z.enum(["Working Class", "Middle Class", "Capitalist Class", "State"])

export const tabNameZod = z.enum(["Actions", "My Class", "All Classes", "Politics", "Marketplace"])