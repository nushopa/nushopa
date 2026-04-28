function splitIntoParagraphs(text = "", sentencesPerParagraph = 3) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const paragraphs = [];
  for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
    const chunk = sentences.slice(i, i + sentencesPerParagraph).join(" ").trim();
    if (chunk) paragraphs.push(chunk);
  }
  return paragraphs;
}

const SplitSection = ({ section, sectionIndex }) => {
  return (
    <div
      className={`flex flex-col md:flex-row min-h-[480px] ${
        sectionIndex !== 0 ? "border-t border-gray-100" : ""
      }`}
    >
      {/* Left — white, title + content1 */}
      <div className="relative flex flex-col justify-center px-8 py-14 md:px-14 md:py-20 md:w-1/2 bg-white">
        {/* Top decorative bar */}
        <div className="absolute top-0 left-0 h-1 w-16 bg-[#1a3c2e]" />

        {/* Label */}
        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1a3c2e] mb-5">
          About Nushopa
        </p>

        {/* Title */}
        <h2 className="text-3xl md:text-[2.4rem] font-extrabold leading-tight text-gray-900 mb-5">
          {section.title}
        </h2>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-[2px] w-10 bg-[#1a3c2e]" />
          <div className="h-[2px] w-3 bg-gray-200" />
        </div>

        {/* content1 */}
        <p className="text-gray-500 text-base md:text-[1.05rem] leading-[1.85]">
          {section.content1}
        </p>
      </div>

      {/* Right — deep green, content2 */}
      <div className="relative flex flex-col justify-center px-8 py-14 md:px-14 md:py-20 md:w-1/2 bg-[#1a3c2e] overflow-hidden">
        {/* Subtle glow circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white opacity-[0.03] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white opacity-[0.03] pointer-events-none" />

        {/* Large decorative quote mark */}
        <div className="text-[80px] leading-none font-serif text-white opacity-10 select-none mb-2 -mt-4">
          &ldquo;
        </div>

        {/* content2 paragraphs */}
        <div className="space-y-5 relative z-10">
          {splitIntoParagraphs(section.content2).map((para, i) => (
            <p key={i} className="text-white/75 text-base leading-[1.9]">
              {para}
            </p>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SplitSection;