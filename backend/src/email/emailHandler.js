import {resendClient, sender} from "../lib/resend.js"
import {createWelcomeEmailTemplate} from "./emailTemplate.js"

export const sendWelcomeEmail = async (email,name) => {
    const {data,error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Flyrr!",
        html: createWelcomeEmailTemplate(name)
    })
    
    if(error){
        console.error("Resend error:", error);
        throw error;
    }

    
    console.log("Welcome email sent successfully:", data);
    return data;
}


