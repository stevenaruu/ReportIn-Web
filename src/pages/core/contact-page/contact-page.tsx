import SubLayout from '@/layouts/sub-layout'
import { useState } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent!");
  };

  return (
    <SubLayout>
      <div className="w-full max-w-6xl mx-auto px-4 mt-16 text-[#5d5d5d]">
        <div className="flex flex-col md:flex-row md:gap-4 items-center md:items-start justify-between">
          {/* Kiri: Judul, teks, ilustrasi */}
          <div className="w-full md:w-[50%] flex flex-col items-center md:items-start mb-6 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">CONTACT</h1>
            <p className="mb-4 leading-snug text-[1.05rem] text-center md:text-left">
              Feel free to contact us for any <br /> questions, suggestions, or support.
            </p>
            <img
              className="w-64 sm:w-80 md:w-full max-w-md mx-auto"
              src="/assets/images/contact.svg"
              alt="Contact"
            />
          </div>

          {/* Kanan: Form */}
          <form
            className="w-full md:w-[50%] max-w-md flex flex-col gap-4 mx-auto md:mx-0 md:pl-6"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="bg-gray-200 placeholder-gray-400 text-[#555C63] rounded-md h-12 px-5 outline-none font-medium w-full"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="bg-gray-200 placeholder-gray-400 text-[#555C63] rounded-md h-12 px-5 outline-none font-medium w-full"
              required
            />
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="bg-gray-200 placeholder-gray-400 text-[#555C63] rounded-md h-12 px-5 outline-none font-medium w-full"
              required
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={4}
              className="bg-gray-200 placeholder-gray-400 text-[#555C63] rounded-md px-5 py-3 outline-none font-medium resize-none w-full"
              required
            />
            <button
              type="submit"
              className="w-full md:w-36 mt-2 bg-red-500 text-white font-bold py-2 rounded-md hover:bg-red-600 transition self-center md:self-end"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </SubLayout>
  )
}

export default ContactPage;