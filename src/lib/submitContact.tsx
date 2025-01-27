import { supabase } from "./supabase";

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface SubmitContactFormResult {
    data: any; 
    error: Error | null;
}

export default async function submitContactForm(data: ContactFormData): Promise<SubmitContactFormResult> {
    const { data: res, error } = await supabase
        .from("Contacts")
        .insert([data]); 

    if (error) {
        console.error("Error submitting contact form:", error);
        return { data: null, error: new Error("Failed to submit contact form") };
    }

    console.log("Contact form submitted successfully:", res);
    return { data: res, error: null };
}