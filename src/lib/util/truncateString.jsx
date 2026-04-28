import DOMPurify from "dompurify";

export const truncateString = (htmlContent, maxLength) => {
  // Strip HTML tags for text truncation
  const plainText = htmlContent.replace(/<[^>]*>/g, "");
  const truncatedText =
    plainText.length > maxLength
      ? `${plainText.substring(0, maxLength)}...`
      : plainText;

  // Return sanitized and truncated content
  return DOMPurify.sanitize(truncatedText);
};
