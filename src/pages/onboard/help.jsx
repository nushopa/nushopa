import { Helmet } from "react-helmet-async";
import Faq from "../../components/molecule/faq/Faq";
import OnboardLayout from "../../layouts/OnboardLayout";

const Help = () => {
  return (
    <OnboardLayout>
      <Helmet>
        <title>Nushopa | Help</title>
        <meta
          name="description"
          content="Need assistance? Nushopa is here to help! Explore our store's comprehensive resources and FAQs to find answers to your queries about farm-fresh produce, delivery, and more. Let us guide you through the journey of experiencing farm-to-table excellence!"
        />
      </Helmet>

      <Faq />
    </OnboardLayout>
  );
};

export default Help;
