import {z} from 'zod';

export const RegisterSchema = z.object({
    firstName: z.string()
        .min(1, {message: "First name is required"}),
    lastName: z.string()
        .min(1, {message: "Last name is required"}),
    email: z.string()
        .min(1, {message: "Email is required"})
        .email({message: "Invalid email address"}),
    username: z.string()
        .min(1, {message: "Username is required"})
        .min(10, {message: "Username must be at least 10 letters"}),
    phoneNumber: z.string()
        .min(1, {message: "Phone number is required"})
        .regex(/^\d+$/, {message: "Phone number must contain only digits"}),
    password: z.string()
        .min(1, {message: "Password is required"}),
    passwordConfirmation: z.string()
        .min(1, {message: "Confirm password is required"}),

}).refine((d) => d.password === d.passwordConfirmation,
    {
        message: "Passwords does not match",
        path: ["passwordConfirmation"]
    })


export type RegisterType = z.infer<typeof RegisterSchema>;
export type registerInterface = RegisterType



