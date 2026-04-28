import { Fragment, useState, useEffect } from "react";
import { STATIC_PRODUCTS } from "../../data/product/productList";
import ProductItem from "./productItem";
import { Link } from "react-router-dom";

const Loader = () => {
  return <div>Loading...</div>;
};

export default function ProductsList() {
  const [loading, setLoading] = useState(true);
  const [generalProduct, setGeneralProduct] = useState([]);

  useEffect(() => {
    // Simulate an API call to fetch data
    setTimeout(() => {
      setGeneralProduct(STATIC_PRODUCTS);
      setLoading(false);
    }, 2000); // Adjust the time as needed
  }, []);

  // Group products by category
  const groupedProducts = generalProduct.reduce((acc, product) => {
    const { category } = product;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  // Extract categories and products
  const categories = Object.keys(groupedProducts);

  return (
    <>
      {loading && <Loader />}

      <div className={`my-9 grid grid-cols-1 ${loading ? "hidden" : ""}`}>
        {/* Render all uncategorized products in a single row */}
        

        {/* Render categorized products in rows */}
        {categories.map((category, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between flex-row mb-6 items-center px-5">
              <div >
                <h2 className="text-xl font-workSans font-bold text-mainGreen  ">
                  {category}
                </h2>
              </div>
              <div>
                <Link to="/" className="px-4 py-2 rounded-md text-mainGreen bg-transparent border border-green-900">
                  view more 
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {groupedProducts[category].map(({ id, ...rest }, i) => (
                <Fragment key={i}>
                  <ProductItem id={id} {...rest} />
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
