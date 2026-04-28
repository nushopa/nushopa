import { StoryData } from "./data";

function splitIntoParagraphs(text = "", sentencesPerParagraph = 3) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const paragraphs = [];
  for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
    const chunk = sentences
      .slice(i, i + sentencesPerParagraph)
      .join(" ")
      .trim();
    if (chunk) paragraphs.push(chunk);
  }
  return paragraphs;
}

const Story = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 py-10 bg-mainGreen shadow-sm">
      {StoryData.map((section, index) => (
        <div key={index} className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D9D9D990] mb-4">
           Who we are
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-[#ffff]  mb-8 leading-tight">
            {section.title}
          </h2>

          <div className="w-12 h-0.5 bg-[#D9D9D990] mb-8" />

          <div className="space-y-5">
            {splitIntoParagraphs(section.content).map((para, i) => (
              <p key={i} className="text-[#D9D9D9] text-base leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Story;
