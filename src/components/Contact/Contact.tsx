import React, { useState } from "react";

import submitContactForm from "../../lib/submitContact";
import { toast } from "react-toastify";
import ContactInformation from "./ContactInformation";
import FormContact from "./FormContact";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await submitContactForm(formData);
      if (error) {
        toast.error("Failed to submit the form. Please try again.");
      } else {
        toast.success("Form submitted successfully!");
        setFormData({ name: "", email: "", message: "" }); // Reset the form
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Get in Touch</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ContactInformation />

          <FormContact formData={formData} handleChange={handleChange} handleSubmit={ handleSubmit} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
