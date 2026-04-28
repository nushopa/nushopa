import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { STATIC_PRODUCTS } from "../../data/product/productList";
import ProductItem from "../products/productItem";
import { CircularPagination } from "../pagination/pagination";
import { Loader } from "../molecule/loader/tabLoader";



const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function TabItem({ category, carter }) {
  const [loading, setLoading] = useState(true);
  const [generalProduct, setGeneralProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedCategory = useDebounce(category, 300); // Debounce category changes

  const getApiUrl = (category, page = 1) => {
    if (category === "Most-Recent") {
      return `product?page=${page}&limit=50`;
    } else {
      const categoryQueryParam = `q=${category}`;
      return `product?${categoryQueryParam}&page=${page}&limit=40`;
    }
  };

  const fetchDataAndSetState = useCallback(async (page = 1) => {
    setLoading(true);
    let baseUrl = import.meta.env.VITE_BASE_URL;
    const apiUrl = getApiUrl(debouncedCategory, page);
    const url = `${baseUrl}${apiUrl}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      setGeneralProduct(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
      setGeneralProduct(STATIC_PRODUCTS);
    } finally {
      setLoading(false);
      (false);
    }
  }, [debouncedCategory]); // Removed isFetching from dependencies

  useEffect(() => {
    setCurrentPage(1);
    fetchDataAndSetState(1);
  }, [debouncedCategory, fetchDataAndSetState]);

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      fetchDataAndSetState(newPage);
      window.scrollTo({
        top: 0,
        behavior: "smooth", // This enables smooth scrolling
      });
    }
  };

  const groupedProducts = generalProduct.reduce((acc, product) => {
    const { product_cat } = product;
    if (!acc[product_cat]) {
      acc[product_cat] = [];
    }
    acc[product_cat].push(product);
    return acc;
  }, {});

  return (
    <>
      {loading && <Loader />}

      <div className={`my-9 grid grid-cols-1 ${loading ? "hidden" : ""}`}>
        {Object.keys(groupedProducts).map((category, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between flex-row mb-6 items-center px-2 md:px-5">
              <h2 className="text-xl font-workSans font-bold text-mainGreen">
                {category}
              </h2>
             
            </div>
            <div className="overflow-x-auto md:overflow-hidden w-full mx-auto">
              <div className="flex flex-row md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
                {groupedProducts[category].map(({ id, ...rest }, index) => (
                  <div key={index}>
                    <div className="hidden md:block">
                      <ProductItem
                        id={id}
                        {...rest}
                        productNameMaxLength={18}
                        productDesMaxLength={50}
                        carter={carter}
                      />
                    </div>
                    <div className="block md:hidden">
                      <ProductItem
                        id={id}
                        {...rest}
                        productNameMaxLength={18}
                        productDesMaxLength={40}
                        carter={carter}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && (
        <div className="flex justify-center my-6">
          <CircularPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
