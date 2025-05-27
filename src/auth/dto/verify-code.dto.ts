import { IsEmail, IsNotEmpty } from "class-validator";

export class VerifyCodeDto{

    @IsNotEmpty({message : "Email is required"})
    @IsEmail({},{message : "Invalid email"})
    email : string


    @IsNotEmpty({message : "Code is required"})
    code : string
}