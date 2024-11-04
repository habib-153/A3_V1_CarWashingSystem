"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        image: zod_1.z.string().optional(),
        email: zod_1.z.string().email({ message: "Provide a valid email" }),
        password: zod_1.z.string({ message: 'Password must be contain 6 Character' }).min(6),
        phone: zod_1.z.string(),
        role: zod_1.z.enum([...user_constant_1.Role]),
        address: zod_1.z.string(),
    })
});
exports.UserValidation = {
    createUserValidationSchema
};
