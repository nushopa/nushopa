const AdsBanner = ({ src, alt = "Advertisement", link, className = "" }) => {
  if (!src) return null;

  const image = (
    <picture className="block w-full h-full">
      <img
        src={src}
        alt={alt}
        className={`w-full h-auto max-h-[60vh] object-cover mx-auto rounded-lg ${className}`}
        loading="lazy"
        draggable={false}
      />
    </picture>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
        draggable={false}
      >
        {image}
      </a>
    );
  }
  return <div className="w-full h-full p-12 bg-[#D9D9D9]">{image}</div>;
};

export default AdsBanner;
