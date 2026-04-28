import { useNavigate } from "react-router-dom";

const HomeBanner = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full overflow-hidden  z-10 pt-3 md:pt-0 pl-4 md:pl-8 h-[30rem] flex flex-col justify-center">
      {/* Responsive Image with Lazy Loading */}
      <img
        src="https://res.cloudinary.com/phantom1245/image/upload/v1734337775/farm2home/Frame_11_1_zdscjt_emu4v0.webp"
        sizes="(max-width: 640px) 640px, (max-width: 1280px) 1280px, 1920px"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#272727] to-[#222] opacity-50 z-[5]"></div>

      {/* Content */}
      <div className="gap-3 text-white z-[9]">
        <h1 className="text-xl md:text-5xl md:w-[70%] xl:w-[55%] font-workSans md:leading-[3.6rem] font-bold">
          Rooted In Quality, Delivered With Passion
        </h1>
        <h2 className="text-md md:text-xl py-2 md:py-4">
          Your preferable online market!
        </h2>
      </div>
      <div className="z-[9]">
        <button
          onClick={() => navigate("/sign-up")}
          className="bg-mainGreen text-sm md:text-base w-[9.5rem] md:w-[15rem] text-white rounded-lg py-3"
        >
          Start Shopping Now
        </button>
      </div>
    </div>
  );
};

export default HomeBanner;
