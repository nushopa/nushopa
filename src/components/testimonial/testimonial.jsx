import { useEffect, useState } from "react";
import { staticTestimonials } from "../../data/testimonials/testimonialData";
import { client } from "../../services/sanity/sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { Card } from "@material-tailwind/react";

const builder = imageUrlBuilder(client);

const Testimonial = () => {
  const [staticTestimonial, setStaticTestimonial] = useState(
    [] || staticTestimonials
  );

  useEffect(() => {
    client
      .fetch('*[_type == "testimonial"] | order(_createdAt asc)')
      .then((data) => {
        const testimonialsWithData = data.map((testimonial) => ({
          ...testimonial,
          profilePictureUrl: builder.image(testimonial.profilePicture).url(),
        }));
        setStaticTestimonial(testimonialsWithData);
      });
  }, []);

  return (
    <div>
     
      <div className="overflow-x-auto w-full mx-auto">
        <div className="flex flex-row md:grid my-5 md:grid-cols-3 gap-4">
          {staticTestimonial.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white p-8 gap-3 rounded-lg flex flex-col items-start justify-start"
            >
              <div className="flex flex-row gap-2 items-start">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={
                      testimonial.profilePictureUrl ||
                      testimonial.profilePicture
                    }
                    srcSet={`
                      ${testimonial.profilePictureUrl || testimonial.profilePicture}?w=56 56w,
                      ${testimonial.profilePictureUrl || testimonial.profilePicture}?w=112 112w,
                      ${testimonial.profilePictureUrl || testimonial.profilePicture}?w=168 168w
                    `}
                    sizes="(max-width: 56px) 56px, (max-width: 112px) 112px, 168px"
                    alt={testimonial.name}
                    className="w-14 h-14 object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h1 className="text-md text-[#000] font-semibold">
                    {testimonial.name}
                  </h1>
                  <h2 className="text-md text-gray-700 font-normal">
                    {testimonial.role}
                  </h2>
                </div>
              </div>
              <div className="px-[7rem] md:px-0"></div>
              <div>
                <p>{testimonial.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;