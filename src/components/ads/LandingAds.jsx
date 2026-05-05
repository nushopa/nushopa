import { useState, useEffect, useRef, useCallback } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import AdsBanner from "./AdsBanner";
import DotsIndicator from "./component/DotsIndicator";
import ProgressBar from "./component/ProgressBar";
import { useGetAdvertsQuery } from "../../services/api";

const LandingAds = ({ autoPlayInterval = 4000, className = "" }) => {
  const { data, isLoading, isError } = useGetAdvertsQuery();

  // Normalize API data to the shape AdsBanner expects
  const ads = (data ?? []).map((ad) => ({
    id: ad._id,
    src: ad.imageUrl,
    alt: ad.title ?? "Ad",
    link: ad.link ?? null,
  }));
  const total = ads.length;

  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (index) => {
      if (animating || index === current) return;
      setAnimating(true);
      setCurrent((index + total) % total);
      setTimeout(() => setAnimating(false), 400);
    },
    [animating, current, total],
  );

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  useEffect(() => {
    if (!autoPlayInterval || total <= 1 || isHovered) return;
    timerRef.current = setInterval(next, autoPlayInterval);
    return () => clearInterval(timerRef.current);
  }, [autoPlayInterval, total, isHovered, next]);

  useEffect(() => {
    if (total <= 1) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, total]);

  const onPointerDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX ?? e.touches?.[0]?.clientX ?? 0);
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const diff = dragStartX - endX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg bg-[#D9D9D9] animate-pulse ${className}`}
      />
    );
  }

  // Error or empty
  if (isError || total === 0) return null;
  if (total === 1) {
    return (
      <div className={`relative overflow-hidden rounded-lg ${className}`}>
        <AdsBanner src={ads[0].src} alt={ads[0].alt} link={ads[0].link} />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg select-none group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => setIsDragging(false)}
      aria-label="Advertisement carousel"
      aria-roledescription="carousel"
    >
      <div
        className="flex h-full will-change-transform"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: animating
            ? "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
        }}
      >
        {ads.map((ad, i) => (
          <div
            key={i}
            className="min-w-full h-full"
            aria-hidden={i !== current}
            aria-label={`Ad ${i + 1} of ${total}`}
          >
            <AdsBanner src={ad.src} alt={ad.alt} link={ad.link} />
          </div>
        ))}
      </div>

      <NavArrow direction="left" onClick={prev} />
      <NavArrow direction="right" onClick={next} />

      <DotsIndicator total={total} current={current} goTo={goTo} />

      {autoPlayInterval > 0 && !isHovered && (
        <ProgressBar duration={autoPlayInterval} key={`${current}-progress`} />
      )}
    </div>
  );
};

const NavArrow = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    aria-label={direction === "left" ? "Previous ad" : "Next ad"}
    className={`
      absolute top-1/2 -translate-y-1/2 z-10
      ${direction === "left" ? "left-2" : "right-2"}
      w-8 h-8 flex items-center justify-center rounded-full
      bg-black/30 hover:bg-black/55 backdrop-blur-sm text-white
      opacity-0 group-hover:opacity-100
      transition-all duration-200
      hover:scale-110 active:scale-95
      focus:outline-none focus-visible:ring-2 focus-visible:ring-white
    `}
  >
    {direction === "left" ? (
      <MdChevronLeft size={22} />
    ) : (
      <MdChevronRight size={22} />
    )}
  </button>
);

export default LandingAds;
