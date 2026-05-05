import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Breadcrumb from "../../components/molecule/breadcrumbs/breadcrumbs";
import ProductItem from "../../components/products/productItem";
import { STATIC_PRODUCTS } from "../../data/product/productList";
import { setCarte } from "../../redux/cart";
import { useDispatch } from "react-redux";
import { Button, SpeedDial, SpeedDialHandler } from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import ProductItemStore from "../../components/products/productItemStore";
import { Helmet } from "react-helmet-async";
import { CircularPagination } from "../../components/pagination/pagination";
import CategoryDrawer from "../../components/drawer/categoryDrawer";
import { scrollToTop } from "../../lib/util/scrollUp";
import DashboardLayout from "../../layouts/DashboardLayout";
import LandingAds from "../../components/ads/LandingAds";

const Loader = () => {
  return <span className="loader"></span>;
};

const Store = () => {
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [generalProduct, setGeneralProduct] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [carter, setCarter] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(!open);
  const closeDrawer = () => setOpen(false);
  const location = useLocation();
  const [searchField, setSearchField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch product data
  const fetchDataAndSetState = useCallback(
    async (page = currentPage) => {
      setLoading(true);
      setError(false);
      const apiUrl = getApiUrl(selectedCategories, page);
      const url = `${baseUrl}${apiUrl}`;
      try {
        const response = await axios.get(url, { timeout: 8000 });
        const data = response.data.products;

        setGeneralProduct(data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setError(true);
        setGeneralProduct(STATIC_PRODUCTS);
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    },
    [baseUrl, currentPage, selectedCategories],
  );

  // Fetch product categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}category/get`);
        const fetchedCategories = response.data.agriculturalCategories.map(
          (category) => category.category,
        );
        setCategories(["All", ...fetchedCategories]);
      } catch (error) {
        // Handle error
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [baseUrl]);

  // Get products based on selected categories and current page
  useEffect(() => {
    fetchDataAndSetState();
  }, [fetchDataAndSetState, currentPage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    setSearchField(query || "");

    if (query) {
      setSelectedCategories(["All"]);
    }
  }, [location.search]);

  // Handle category toggles
  const handleCategoryToggle = (category) => {
    setSelectedCategories(() => {
      if (category === "All") {
        setCurrentPage(1);
        closeDrawer();
        scrollToTop();
        return ["All"];
      } else {
        setCurrentPage(1);
        navigate("/");
        closeDrawer();
        scrollToTop();
        return [category];
      }
    });
  };

  // Handle user cart fetching
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios.get(`${baseUrl}cart/get/${userId}`).then((response) => {
        if (response.data) {
          setCarter(response.data.cart);
          dispatch(setCarte(response.data.cart));
        }
      });
    }
  }, [baseUrl, dispatch]);

  const normalizedSearch = searchField.toLowerCase().trim();

  const filteredProducts = generalProduct.filter((product) => {
    if (!normalizedSearch) return true;

    const priceMatch = String(product.product_price).includes(normalizedSearch);

    return (
      product.product_name.toLowerCase().includes(normalizedSearch) ||
      product.product_cat.toLowerCase().includes(normalizedSearch) ||
      product.product_brand_name.toLowerCase().includes(normalizedSearch) ||
      product.product_sub_cat.toLowerCase().includes(normalizedSearch) ||
      priceMatch
    );
  });

  const getApiUrl = (selectedCategories, page) => {
    if (selectedCategories.includes("All")) {
      return `product?page=${page}&limit=20`;
    } else {
      const categoryQueryParam = selectedCategories
        .map((category) => `q=${category.replace(/\s/g, "%20")}`)
        .join("&");
      return `product?${categoryQueryParam}&page=${page}&limit=20`;
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      fetchDataAndSetState(newPage);
      scrollToTop();
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Nushopa | Our Store</title>
        <meta
          name="description"
          content="Welcome to Nushopa's store - your ultimate hub for farm-fresh, locally-sourced produce brought straight to you."
        />
      </Helmet>

      <LandingAds className="h-full w-full" />
      
      <Breadcrumb categories={selectedCategories} />

      <div className="relative flex md:flex-row flex-col w-full gap-3 mt-7 font-workSans">
        <div className="fixed bottom-4 right-3 z-[999]">
          <SpeedDial placement="bottom">
            <SpeedDialHandler>
              <Button
                onClick={openDrawer}
                className="flex md:hidden p-3 rounded-full z-[9]"
              >
                <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
              </Button>
            </SpeedDialHandler>
          </SpeedDial>
        </div>

        <CategoryDrawer
          open={open}
          closeDrawer={closeDrawer}
          categories={categories}
          selectedCategories={selectedCategories}
          handleCategoryToggle={handleCategoryToggle}
        />

        <div className="hidden md:block mr-4 bg-white w-full md:w-[25%] sticky top-28 h-full overflow-x-auto p-4 rounded-lg">
          <h3 className="mb-4 font-bold">Categories</h3>
          <ul>
            {categories.map((category, index) => (
              <li key={index} className="mb-2">
                <label className="flex items-center cursor-pointer ">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="accent-mainGreen w-5 h-5 mr-2"
                  />
                  <span
                    className={
                      selectedCategories.includes(category)
                        ? "text-mainGreen font-bold"
                        : ""
                    }
                  >
                    {category}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {loading && <Loader />}

        {!loading && !error && filteredProducts.length === 0 && (
          <div>No matching products found.</div>
        )}

        {!loading && (
          <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((data, index) => (
              <div key={index}>
                <div className="mb-6 z-[0] block md:hidden w-full">
                  <ProductItemStore
                    {...data}
                    productNameMaxLength={19}
                    productDesMaxLength={56}
                    carter={carter}
                  />
                </div>
                <div className="mb-2 hidden md:block w-full">
                  <ProductItem
                    {...data}
                    productNameMaxLength={19}
                    productDesMaxLength={36}
                    carter={carter}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex w-full justify-center items-center mx-auto my-10">
          <CircularPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Store;
