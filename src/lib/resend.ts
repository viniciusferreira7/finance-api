import { Resend } from 'resend'

import { env } from '@/env'

export const resend = new Resend(env.SEND_API_KEY)
