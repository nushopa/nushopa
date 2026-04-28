import { useRef, useEffect } from "react";
import gsap from "gsap";
import Navigations from "../../components/common/navigations";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const container = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Staggered animation sequence
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1 }
    );
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.5, delay: 0.5 }
    );
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 1.5 }
    );
  }, []);

  return (
    <>
      <Navigations />
      <div 
        ref={container}
        className="min-h-screen flex flex-col items-center py-8 bg-gradient-to-br from-green-100 to-white"
      >
        {/* Error Message */}
        <div ref={textRef} className="text-center">
          <p className="text-xl md:text-2xl font-workSans text-gray-700">
            Lost in the crop fields...
          </p>
        </div>
        {/* Illustration */}
        <div ref={imageRef} className="my-8 w-10/12 md:w-[35%]">
          <img
            src="https://res.cloudinary.com/phantom1245/image/upload/v1709763424/farm2home/undraw_page_not_found_re_e9o6_1_tg87po.png"
            alt="Page not found illustration"
            className="w-full"
            loading="lazy"
          />
        </div>
        {/* Return Home Button */}
        <div ref={buttonRef}>
          <Button
            className="w-60 bg-mainGreen hover:bg-green-700 transition-all duration-300"
            onClick={() => navigate("/")}
          >
            RETURN HOME
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
