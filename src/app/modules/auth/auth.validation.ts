import { z } from "zod";

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string().email({message: 'Invalid email address'}),
        password: z.string(),
    }),
})
export const AuthValidation = {
    loginValidationSchema,
}