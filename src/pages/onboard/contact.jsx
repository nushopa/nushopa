import { useState } from "react";
import GeneralInquiries from "../../components/molecule/generalInquires/GeneralInquires";
import OnboardLayout from "../../layouts/OnboardLayout";
import { useAddContactMutation } from "../../services/api";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { FooterWithSitemap } from "../../components/common/footer/Footer";

const Contact = () => {
  const [addContact] = useAddContactMutation();
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  let postData = {
    fullname: fullname,
    email: email,
    message: message,
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await addContact({ data: postData });
      if (response.data) {
        toast.success(response.data.message);
        setEmail("");
        setFullName("");
        setMessage("");
      } else if (response.error.data) {
        // toast.error(response.error.data.message);
      }
    } catch (e) {
      // toast.error(e);
    }
  };
  return (
    <>
      <OnboardLayout>
        <Helmet>
          <title>Nushopa | Contact</title>
          <meta
            name="description"
            content="Got questions or feedback? Contact Nushopa today! Whether you need assistance with your order, have inquiries about our farm-fresh produce, or want to provide feedback, our team is here to help. Reach out to us and let's connect as we strive for farm-to-table excellence together!"
          />
        </Helmet>

        <div className="w-[95%] md:w-[80%] mx-auto flex flex-col bg-white rounded-lg justify-center">
          <div className="w-full lg:flex px-1 md:px-4  my-8 bg-white rounded-lg">
            <GeneralInquiries />
            <div className="w-[95%] md:w-[80%]">
              <div className="bg-white rounded-lg p-4 md:p-7">
                <h2 className="text-xl font-semibold font-workSans mb-4">
                  Request Information
                </h2>
                <form onSubmit={handleClick}>
                  <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                    <div className="w-full">
                      <label
                        htmlFor="firstName"
                        className="text-[#000] mb-2 font-workSans text-md font-semibold"
                      >
                        Full Name:
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={fullname}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
                      />
                    </div>
                  </div>
                  <div className=" gap-4 md:gap-5">
                    <div className="w-full">
                      <label
                        htmlFor="email"
                        className="text-[#000] font-workSans font-semibold"
                      >
                        Email:
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="text-[#000] font-workSans font-semibold"
                    >
                      Message:
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Enter your message here "
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-mainGreen text-white py-3 px-5 rounded-md hover:bg-green-600 mt-4"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </OnboardLayout>

      <FooterWithSitemap />
    </>
  );
}

export default Contact