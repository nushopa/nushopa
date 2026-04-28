import { companyData } from "./data";

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

const Company = () => {
  return (
    <section className="w-full bg-gray-50 py-16 px-6 md:px-12">
      {companyData.map((section, index) => (
        <div key={index} className="max-w-5xl mx-auto">

          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1a3c2e] mb-4">
            Company
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            {section.title}
          </h2>

          <div className="w-12 h-0.5 bg-[#1a3c2e] mb-8" />

          <div className="space-y-5">
            {splitIntoParagraphs(section.content).map((para, i) => (
              <p key={i} className="text-gray-600 text-base leading-relaxed">
                {para}
              </p>
            ))}
          </div>

        </div>
      ))}
    </section>
  );
};

export default Company;