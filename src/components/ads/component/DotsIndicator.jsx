const DotsIndicator = ({ total, current, goTo }) => (
  <div
    className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10"
    role="tablist"
    aria-label="Ad slides"
  >
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        role="tab"
        aria-selected={i === current}
        aria-label={`Go to ad ${i + 1}`}
        onClick={() => goTo(i)}
        className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          i === current
            ? "w-5 h-2 bg-mainGreen shadow-md"
            : "w-2 h-2 bg-mainGreen/50 hover:bg-mainGreen/80"
        }`}
      />
    ))}
  </div>
);

export default DotsIndicator;