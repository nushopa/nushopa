import { useEffect, useState } from "react";
import { FaqList } from "../../../data/faqs/faqList";
import FaqItem from "./faqItems";
import { client } from "../../../services/sanity/sanityClient";

const Faq = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [faqList, setFaqlist] = useState([] || FaqList);
  useEffect(() => {
    client
      .fetch('*[_type == "FaqList"] | order(_createdAt asc)')
      .then((data) => {
        setFaqlist(data[0].faqs)
      })

  }, []);
  const handleClick = (id) => {
    setIsOpen({
      ...isOpen,
      [id]: !isOpen[id]
    });
  };

  return ( 
    <>
      {faqList.map((list, index) => (
        <FaqItem
          key={index}
          list={list}
          isOpen={isOpen}
          index={index}
          handleClick={handleClick}
        />
      ))}
    </>
  );
}
 
export default Faq;