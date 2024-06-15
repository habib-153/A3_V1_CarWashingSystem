import { z } from "zod";
import { IsBooked } from "./slot.constant";

const createSlotValidationSchema = z.object({
    body: z.object({
        service: z.string(),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        isBooked: z.enum([...IsBooked] as [string, ...string[]]).optional(),
    })
})

export const SlotValidation = {
    createSlotValidationSchema
}