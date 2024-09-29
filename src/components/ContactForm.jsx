import emailjs from "@emailjs/browser";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiSend } from "react-icons/fi";
import { motion } from "framer-motion";


const emailId = import.meta.env.emailId;
const templateId = import.meta.env.templateId;
const publicId = import.meta.env.publicId;



/**
 * The ContactForm component renders a form for sending emails to me.
 *
 * The component will show errors if the user enters invalid data and
 * will send the email if the data is valid.
 *
 * @returns {ReactElement} The ContactForm component.
 */
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = (e) => {
    let errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.message) errors.message = "Message is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateErrors = validate();
    if (Object.keys(validateErrors).length > 0) {
      setErrors(validateErrors);
    } else {
      setErrors({});
      setIsSending(true);

      emailjs
        .send(
          emailId,
          templateId,
          formData,
          publicId,
        )
        .then((response) => {
          toast.success("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        })
        .catch((error) => {
          console.log("FAILED...", error);
          toast.error("Message sending failed!. Please try again later");
        })
        .finally(() => {
          setIsSending(false);
        });
    }
  };
  return (
    <div className="p-4 lg:w-3/4" id="contact">
      <Toaster />
      <h2 className="my-8 text-center text-4xl font-semibold tracking-tighter">
        Let's Connect
      </h2>
      <motion.form
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex space-x-4">
          <div className="lg:w-1/2">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              placeholder="Name"
              onChange={handleChange}
              className="mb-8 w-full appearance-none rounded-lg
                    border border-stone-50/30 bg-transparent px-3 py-2
                    text-sm focus:border-stone-400 focus:outline-none"
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-sm text-rose-800"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          <div className="lg:w-1/2">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              className="mb-8 w-full appearance-none rounded-lg
                    border border-stone-50/30 bg-transparent px-3 py-2
                    text-sm focus:border-stone-400 focus:outline-none"
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-sm text-rose-800"
              >
                {errors.email}
              </motion.p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <textarea
            name="message"
            id="message"
            value={formData.message}
            placeholder="Message"
            onChange={handleChange}
            className="mb-8 w-full appearance-none rounded-lg
                    border border-stone-50/30 bg-transparent px-3 py-2
                    text-sm focus:border-stone-400 focus:outline-none"
            rows="6"
          ></textarea>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-sm text-rose-800"
            >
              {errors.message}
            </motion.p>
          )}
        </div>
        <button
          type="submit"
          className={`mb-8 w-full rounded border
            border-stone-50/30 bg-stone-200 px-4 py-2 text-sm font-semibold 
            text-stone-900 hover:bg-stone-300 ${
              isSending ? "cursor-not-allowed opacity-50" : ""
            }`}
          disabled={isSending}
        >
          <div className="flex items-center justify-center gap-2">
            {isSending ? "Sending..." : "Send"}
            <FiSend />
          </div>
        </button>
      </motion.form>
    </div>
  );
};

export default ContactForm;
