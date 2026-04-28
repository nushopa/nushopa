import {
  BoltIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import AltLayout from "../../layouts/AltLayout";
import { FooterWithSitemap } from "../../components/common/footer/Footer";

export default function Logistics() {
  return (
    <>
      <AltLayout>
        <div className="overflow-hidden bg-gray-50">
          {/* Hero Section */}
          <section className="relative h-[75vh] flex items-center justify-center text-white">
            <img
              src="https://res.cloudinary.com/phantom1245/image/upload/v1735873680/farm2home-logistics/logis_fr5wwd.webp"
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-75 transition-transform duration-1000 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/70"></div>
            <div className="relative z-10 text-center px-6 md:px-12 animate-fadeIn">
              <h1 className="text-4xl md:text-7xl font-extrabold font-workSans tracking-tight drop-shadow-lg">
                Elevate Your Logistics Experience
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg md:text-2xl drop-shadow">
                Empowering Market Reps to source premium goods and Drivers to
                deliver excellence.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-6">
                <button
                  onClick={() =>
                    (window.location.href = "https://marketrep.netlify.app/")
                  }
                  className="flex items-center justify-center gap-2 bg-mainGreen hover:bg-green-600 transition-all duration-300 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform hover:scale-105"
                >
                  <UserGroupIcon className="w-6 h-6" />
                  <span>Join as Market Rep</span>
                </button>
                <button
                  onClick={() =>
                    (window.location.href =
                      "https://Nushopa-driver.netlify.app/")
                  }
                  className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 transition-all duration-300 text-mainGreen font-semibold py-3 px-6 rounded-full shadow-lg transform hover:scale-105"
                >
                  <TruckIcon className="w-6 h-6" />
                  <span>Join as Driver</span>
                </button>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 md:px-20">
              <h2 className="text-3xl md:text-5xl font-bold text-center text-mainGreen mb-12">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Market Rep Card */}
                <div className="bg-white rounded-2xl p-8 shadow-2xl transition-transform duration-300 hover:-translate-y-2">
                  <div className="flex flex-col items-center">
                    <UserGroupIcon className="w-20 h-20 text-mainGreen mb-6" />
                    <h3 className="text-2xl font-bold text-mainGreen mb-4 text-center">
                      Market Reps
                    </h3>
                    <p className="text-center text-sm">
                      Our dedicated Market Reps scour local markets to source
                      the finest goods—ensuring quality before handing them over
                      to our expert Drivers.
                    </p>
                  </div>
                </div>
                {/* Driver Card */}
                <div className="bg-white rounded-2xl p-8 shadow-2xl transition-transform duration-300 hover:-translate-y-2">
                  <div className="flex flex-col items-center">
                    <TruckIcon className="w-20 h-20 text-mainGreen mb-6" />
                    <h3 className="text-2xl font-bold text-mainGreen mb-4 text-center">
                      Drivers
                    </h3>
                    <p className="text-center text-sm">
                      Our professional Drivers pick up goods from Market Reps
                      and deliver them swiftly to your doorstep, ensuring a
                      seamless experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-6 md:px-20">
              <h2 className="text-3xl md:text-5xl font-bold text-center text-mainGreen mb-12">
                Why Choose Us?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-xl transition-transform duration-300 hover:scale-105">
                  <div className="flex flex-col items-center">
                    <BoltIcon className="w-12 h-12 text-mainGreen mb-4" />
                    <h3 className="text-xl font-bold text-mainGreen mb-2">
                      Fast & Efficient
                    </h3>
                    <p className="text-center text-sm">
                      Lightning-fast pickups and deliveries keep you ahead of
                      the game.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-xl transition-transform duration-300 hover:scale-105">
                  <div className="flex flex-col items-center">
                    <CheckCircleIcon className="w-12 h-12 text-mainGreen mb-4" />
                    <h3 className="text-xl font-bold text-mainGreen mb-2">
                      Reliable Service
                    </h3>
                    <p className="text-center text-sm">
                      Count on us for consistent performance and exceptional
                      quality.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-xl transition-transform duration-300 hover:scale-105">
                  <div className="flex flex-col items-center">
                    <ShoppingCartIcon className="w-12 h-12 text-mainGreen mb-4" />
                    <h3 className="text-xl font-bold text-mainGreen mb-2">
                      Quality Sourcing
                    </h3>
                    <p className="text-center text-sm">
                      We source only the best products, ensuring top quality
                      every time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final Call-to-Action Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 md:px-20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-mainGreen mb-6">
                Ready to Revolutionize Your Delivery?
              </h2>
              <p className="text-base md:text-xl mb-8 max-w-2xl mx-auto">
                Join our logistics revolution and be part of a seamless process
                that connects quality sourcing with fast, reliable delivery.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button
                  onClick={() =>
                    (window.location.href = "https://marketrep.netlify.app/")
                  }
                  className="flex items-center justify-center gap-2 bg-mainGreen hover:bg-green-600 transition-all duration-300 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform hover:scale-105"
                >
                  <UserGroupIcon className="w-6 h-6" />
                  <span>Join as Market Rep</span>
                </button>
                <button
                  onClick={() =>
                    (window.location.href = "https://marketrep.netlify.app/")
                  }
                  className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 transition-all duration-300 text-mainGreen font-semibold py-3 px-6 rounded-full shadow-lg transform hover:scale-105"
                >
                  <TruckIcon className="w-6 h-6" />
                  <span>Join as Driver</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </AltLayout>

      <FooterWithSitemap />
    </>
  );
}
