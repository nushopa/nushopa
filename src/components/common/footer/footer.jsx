import { SITEMAP } from "../../../data/sitemaps/sitemap";
import { useSelector } from "react-redux";
import { useSubscribeNewsletterMutation } from "../../../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { client } from "../../../services/sanity/sanityClient";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const currentYear = new Date().getFullYear();

export function FooterWithSitemap() {
  const { user } = useSelector((state) => state.user);
  const [sitemap, setSitemap] = useState([] || SITEMAP);
  const isLoggedIn = user?._id;
  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    client
      .fetch('*[_type == "Sitemap"] | order(_createdAt asc)')
      .then((data) => setSitemap(data));
  }, []);

  const handleSubscribe = async (e) => {
    e?.preventDefault();
    try {
      if (email && email !== "") {
        await subscribeNewsletter({ email });
        toast.success("Successfully subscribed!");
        setEmail("");
      } else {
        toast.info("Please enter a valid email address.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const newsletterColumn = sitemap.find(
    ({ title }) => title === "Subscribe to our Newsletter"
  );
  const navColumns = sitemap.filter(
    ({ title }) => title !== "Subscribe to our Newsletter"
  );

  return (
    <footer className="w-full bg-mainGreen text-white">
      <div className="mx-auto w-full max-w-7xl px-8 py-16">

        {/* Top section: Logo + Nav columns + Newsletter */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 pb-12 border-b border-white/20">

          {/* Logo & tagline */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <a href="/">
              <img
                src="https://res.cloudinary.com/phantom1245/image/upload/v1748627228/farm2home/nushoper_White-1_pfwupl.png"
                alt="Farm2Home"
                className="w-40 h-auto"
                loading="lazy"
              />
            </a>
            <p className="text-md text-white/60 leading-relaxed max-w-[180px]">
              Fresh from the farm, delivered to your door.
            </p>
          </div>

          {/* Nav columns */}
          {navColumns.map(({ title, links }, key) => (
            <div key={key} className="lg:col-span-1">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {Array.isArray(links) &&
                  links.map((link, index) => {
                    if (typeof link !== "object") return null;
                    if (isLoggedIn && (link.label === "Sign Up" || link.label === "Log In"))
                      return null;
                    return (
                      <li key={index}>
                        <a
                          href={link.targetLink}
                          className="text-sm text-white/75 hover:text-white transition-colors duration-150"
                        >
                          {Object.values(link.label)}
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {newsletterColumn && (
            <div className="lg:col-span-1">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
                Newsletter
              </h3>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">
                Get weekly deals and farm updates.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-mainGreen font-semibold text-sm rounded-lg py-2.5 hover:bg-white/90 active:bg-white/80 transition-colors disabled:opacity-60"
                >
                  {isLoading ? "Subscribing…" : "Subscribe"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-xs text-white/50">
            &copy; {currentYear}{" "}
            <a
              href="https://newusual.com/"
              className="hover:text-white transition-colors"
            >
              New Usual Limited
            </a>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61561678254564&mibextid=ZbWKwL"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-white/50 hover:text-white transition-colors"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="https://www.instagram.com/farm2home4ng?igsh=NmZ3ZnRvNm94OGU1"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-white/50 hover:text-white transition-colors"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="https://x.com/Farm2homeng?t=T2mf9m95c3WCD7o9bc36wQ&s=09"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="text-white/50 hover:text-white transition-colors"
            >
              <FaXTwitter size={16} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}