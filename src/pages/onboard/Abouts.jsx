import OnboardLayout from "../../layouts/OnboardLayout";
import { Helmet } from "react-helmet-async";
import Testimonial from "../../components/testimonial/Testimonial";
import Company from "./component/Company";
import Story from "./component/Story";
import Choose from "./component/Choose";
import { FooterWithSitemap } from "../../components/common/footer/Footer";

const Abouts = () => {
  return (
    <>
      <OnboardLayout>
        <Helmet>
          <title>Nushopa | About Us</title>
          <meta
            name="description"
            content="Discover Nushopa, your premier destination for fresh, locally-sourced farm produce delivered directly to your door."
          />
        </Helmet>

        <div>
          <Company />
        </div>

        <div className="my-4">
          <Story />
        </div>
        <div>
          <Choose />
        </div>
        <div className="py-10">
          <Testimonial />
        </div>
      </OnboardLayout>
      <FooterWithSitemap />
    </>
  );
};

export default Abouts;
