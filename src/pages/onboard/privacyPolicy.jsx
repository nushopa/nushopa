import { useEffect, useState } from "react";
import OnboardLayout from "../../layouts/onboardLayout";
import { client } from "../../services/sanity/sanityClient";
import BlockContent from "@sanity/block-content-to-react";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState([]);
  useEffect(() => {
    client
      .fetch('*[_type == "PrivacyPolicyPage"] | order(_createdAt asc)')
      .then((data) => {
        setPrivacyPolicy(data);
      })
  }, []);
  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    // Convert month name to abbreviated format
    const month = formattedDate.split(" ")[0];

    // Convert day to ordinal format
    const day = formattedDate.split(" ")[1].replace(/,/g, "");
    const ordinalDay =
      day +
      (day === "1" || day === "21" || day === "31"
        ? "st"
        : day === "2" || day === "22"
          ? "nd"
          : day === "3" || day === "23"
            ? "rd"
            : "th");

    // Construct the final formatted date
    return `${ordinalDay} ${month}, ${date.getFullYear()}`;
  };
  return (
    <OnboardLayout>
      <Helmet>
        <title>Nushopa | Privacy Policy</title>
        <meta
          name="description"
          content="Protecting your privacy is our priority at Nushopa. Learn about how we collect, use, and protect your personal information in our comprehensive Privacy Policy. We are committed to safeguarding your data and ensuring transparency in our practices as we strive for farm-to-table excellence together!"
        />
      </Helmet>

      <div className="bg-white px-5 pt-7 pb-14 md:px-12 md:pt-12 md:pb-32 rounded-lg">
        {privacyPolicy?.map((item, index) => (
          <div key={index}>
            <h1 className="font-workSans text-xl py-3 font-semibold text-[#000]">
              {item.title || "Privacy Policy"}
            </h1>
            <div className="font-workSans text-[#7B7B7B]">
              <BlockContent blocks={item.content} />
              This Privacy Policy was last updated on{" "}
              <i>{formatDate(item._updatedAt)}</i>
            </div>
          </div>
        ))}
      </div>
    </OnboardLayout>
  );
};

export default PrivacyPolicy;
