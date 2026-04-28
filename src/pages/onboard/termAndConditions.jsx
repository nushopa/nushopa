/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import OnboardLayout from "../../layouts/OnboardLayout";
import { client } from "../../services/sanity/sanityClient";
import BlockContent from "@sanity/block-content-to-react";
import { Helmet } from "react-helmet-async";

const TermsAndConditions = () => {
  const [termsAndConditions, setTermsAndConditions] = useState([]);
  useEffect(() => {
    client
      .fetch('*[_type == "TermsAndConditionsPage"] | order(_createdAt asc)')
      .then((data) => {
        setTermsAndConditions(data);
      })
  }, []);
  return (
    <OnboardLayout>
      <Helmet>
        <title>Nushopa | Terms and Conditions</title>
        <meta
          name="description"
          content="Before using Nushopa's services, familiarize yourself with our Terms and Conditions. These terms outline the rules, responsibilities, and agreements governing your use of our platform, ensuring a fair and transparent relationship between you and Nushopa. By using our services, you acknowledge and agree to abide by these terms as we strive for farm-to-table excellence together!"
        />
      </Helmet>

      <div className="bg-white px-5 pt-7 pb-14 md:px-12 md:pt-12 md:pb-32 rounded-lg">
        {termsAndConditions?.map((item, index) => (
          <div key={index}>
            <h1 className="font-workSans text-xl py-3 font-semibold text-[#000]">
              {item.title || "Terms and Conditions"}
            </h1>
            <div className="font-workSans text-[#7B7B7B]">
              <p>
                Welcome to Nushopa! These terms and conditions outline the
                rules and regulations for the use of Nushopa's website.
              </p>

              <p>
                By accessing this website, we assume you accept these terms and
                conditions. Do not continue to use Nushopa if you do not agree
                to take all of the terms and conditions stated on this page.
              </p>
              {item.content.map((item, index) => (
                <div key={index}>
                  <h2 className="text-lg font-semibold mt-4 mb-2">
                    {item.heading}
                  </h2>
                  <BlockContent blocks={item.text} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </OnboardLayout>
  );
};

export default TermsAndConditions;
