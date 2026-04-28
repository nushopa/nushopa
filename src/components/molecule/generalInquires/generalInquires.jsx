import { useEffect, useState } from "react";
import { client } from "../../../services/sanity/sanityClient";

const GeneralInquiries = () => {
  const [generalInquires, setGeneralInquires] = useState([]);
  useEffect(() => {
    client
      .fetch('*[_type == "generalInquiries"] | order(_createdAt asc)')
      .then((data) => {
        setGeneralInquires(data);
      })
  }, []);
  return (
    <div className="px-2 ">
      <div className="relative text-[#000] rounded-lg h-max p-6 md:px-10">
        <h2 className="text-xl font-semibold font-workSans mb-4">
          General Inquiries
        </h2>
        {generalInquires?.map((item, index) => (
          <div key={index}>
            <div className="pt-6 md:pt-9 flex flex-col gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <strong>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </strong>{" "}
                <span className="text-[#7B7B7B]">
                  {item?.phoneNumbers?.map((item, pindex) => (
                    <div key={pindex}>
                      <a href={`tel:${item.replace(/-/g, "")}`}>{item}</a>
                    </div>
                  ))}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <strong>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </strong>{" "}
                <span className="text-[#7B7B7B]">
                  {item?.emailAddresses?.map((item, pindex) => (
                    <div key={pindex}>
                      <a href={`mailto:${item}`}>{item}</a>
                    </div>
                  ))}
                </span>
              </div>
              <h2 className="text-xl font-semibold font-workSans mb-2 mt-2">
                Our Office Address
              </h2>
              <div className="flex items-center gap-3">
                <strong>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </strong>{" "}
                <div className="w-[70%] text-[#7B7B7B]">
                  {item.officeAddress ||
                    "14B, King Ologunkutere Street, Parkview Estate, Ikoyi, Lagos Island. Nigeria"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralInquiries;
