import { z } from "zod";
import { Role } from "./user.constant";

const createUserValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        image: z.string().optional(),
        email: z.string().email({message: "Provide a valid email"}),
        password: z.string({message: 'Password must be contain 6 Character'}).min(6),
        phone: z.string(),
        role: z.enum([...Role] as [string, ...string[]]),
        address: z.string(),
    })
})

export const UserValidation = {
    createUserValidationSchema
}