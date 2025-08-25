import {z} from 'zod'

export const verifyCodeSchema = z.object({
    code : z.string().length(6, 'maxiume code is 6 digit')
})