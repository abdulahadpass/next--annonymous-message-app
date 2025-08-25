import {z} from 'zod'

export const isVerifiedSchema = z.object({
    isVerified : z.boolean()
})