const ProductImage = ({ product_image, truncatedProductName }) => (
  <picture>
    <source
      srcSet={`${product_image
        .replace(".png", ".webp")
        .replace(".jpg", ".webp")}`}
      type="image/webp"
    />
    <source srcSet={product_image} type="image/jpeg" />
    <img
      src={product_image} // Fallback for older browsers and in case WebP fails
      alt={truncatedProductName}
      className="h-[150px] w-[150px] object-cover mx-auto rounded-lg"
      loading="lazy"
    />
  </picture>
);

export default ProductImage;
