import { z } from "zod";
import { emailValidation, nameValidation, passwordValidation, phoneValidation, verificationCodeValidation } from "./validationSchema";
export const signupSchema = z.object({ 
    name: nameValidation, 
    email: emailValidation, 
    phone: phoneValidation, 
    verificationCode: verificationCodeValidation, 
    password: passwordValidation, 
    confirmPassword: passwordValidation,
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
