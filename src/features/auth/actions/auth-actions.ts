"use server";

import { authService } from "../services/AuthService";
import { ChangePasswordInput, ChangePassworSchema, ForgotPasswordInput, ForgotPasswordSchema, SetPasswordInput, SetPasswordSchema, SignInInput, SignInSchema, SignUpInput, SignUpSchema } from "../schemas/authSchema";
import { getClientIp } from "@/src/shared/utils/ip";
import { ratelimit } from "@/src/lib/limiter";
import { getMinutesDiffFromNow } from "@/src/shared/utils/date";
import { requireAuth } from "@/src/lib/auth-server";

export type SignUpActionResult = {
    error: string;
    success: string;
};

export async function signUpAction(input: SignUpInput): Promise<SignUpActionResult> {



    const ip = await getClientIp()
    const { success, reset } = await ratelimit.limit(ip)

    if (!success) {
        return {
            error: `Limite Alcanzado. intenta en ${getMinutesDiffFromNow(reset)} Minutos`,
            success: ''
        }
    }

    const data = SignUpSchema.safeParse(input);

    if (!data.success) {
        return {
            error: "Error en la validación de los datos",
            success: "",
        };
    }

    const response = await authService.register(data.data)
    return response

}
export async function signInAction(input: SignInInput) {

    const ip = await getClientIp()
    const { success, reset } = await ratelimit.limit(ip)

    if (!success) {
        return {
            error: `Limite Alcanzado. intenta en ${getMinutesDiffFromNow(reset)} Minutos`,
            success: ''
        }
    }

    const data = SignInSchema.safeParse(input)
    if (!data.success) {
        return {
            error: "Error en la validación de los datos",
            success: " "
        }
    }
    const response = await authService.login(data.data)
    return response
}
export async function forgotPasswordAction(input: ForgotPasswordInput) {

    const ip = await getClientIp()
    const { success, reset } = await ratelimit.limit(ip)

    if (!success) {
        return {
            error: `Limite Alcanzado. intenta en ${getMinutesDiffFromNow(reset)} Minutos`,
            success: ''
        }
    }


    const data = ForgotPasswordSchema.safeParse(input)
    if (!data.success) {
        return {
            error: 'hubo un error...',
            success: ''
        }
    }
    const response = await authService.requestPasswordReset(data.data)
    return response

}

export async function setPasswordAction(input: SetPasswordInput, token: string) {

    const ip = await getClientIp()
    const { success, reset } = await ratelimit.limit(ip)

    if (!success) {
        return {
            error: `Limite Alcanzado. intenta en ${getMinutesDiffFromNow(reset)} Minutos`,
            success: ''
        }
    }
    const data = SetPasswordSchema.safeParse(input)
    if (!data.success) {
        return {
            error: 'Hubo un Error',
            success: ''
        }
    }

    const response = await authService.confirmPasswordReset(data.data, token)
    return response
}
export async function ChangePasswordAction(input: ChangePasswordInput) {
    const { session } = await requireAuth()
    const data = ChangePassworSchema.safeParse(input)
    if(!session || !data.success) {
        return {
            error: 'Hubo un error',
            success: '',
        }
    }

    const result = await authService.changePassword(data.data)
    return result
   
}