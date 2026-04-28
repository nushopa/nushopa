import { useNavigate } from "react-router-dom";

export default function HomeAds() {
  let navigate = useNavigate();
  const location = window.location.pathname;
  return (
    <div className="flex flex-col md:flex-row my-12 px-3 md:px-0 gap-6 w-full">
      <div className="w-full md:w-1/2">
        <img
          src="https://res.cloudinary.com/phantom1245/image/upload/v1734338031/farm2home/Rectangle_1_1_kyjr9k_qicdv7.webp"
          sizes="(max-width: 640px) 640px, (max-width: 1280px) 1280px, 1920px"
          alt="Farm to Home Image"
          className="object-cover"
          loading="lazy"
        />
      </div>

      <div className="w-full md:w-1/2 justify-center flex flex-col">
        <div className="w-full md:w-[68%] text-[#000] font-workSans text-lg font-normal py-3">
          Join over 10,000+ Customer’s to shop in our platform and get your
          orders delivered at your doorstep today.
        </div>
        {location == "/" ? null : (
          <div>
            <button
              onClick={() => navigate("/sign-up")}
              className="bg-mainGreen w-[12rem]  text-white rounded-lg py-3"
            >
              Start Shopping Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
