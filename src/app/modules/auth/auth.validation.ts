import { z } from "zod";

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string().email({message: 'Invalid email address'}),
        password: z.string({message: 'Password must be contain 6 Character'}).min(6),
    }),
})
export const AuthValidation = {
    loginValidationSchema,
}