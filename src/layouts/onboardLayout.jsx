import { useNavigate } from "react-router-dom";
import OnboardBanner from "../components/banner/onboardBanner";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";

export default function OnboardLayout({ children }) {
  const navigate = useNavigate();
  const [searchField, setSearchField] = useState("");
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);

  let baseUrl = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    axios
      .get(`${baseUrl}product`)
      .then((response) => {
        if (response.data) {
          setDetails(response.data.products);
          setFilteredDetails(response.data.products); // Initialize filteredDetails with all products
        }
      })
  }, [baseUrl]);

  // Update filteredDetails whenever searchField changes
  useEffect(() => {
    const filteredProducts = details.filter(
      (product) =>
        product.product_name
          .toLowerCase()
          .includes(searchField.toLowerCase()) ||
    product.product_cat.toLowerCase().includes(searchField.toLowerCase()) ||
    product.product_brand_name
      .toLowerCase()
      .includes(searchField.toLowerCase()) ||
    product.product_sub_cat
      .toLowerCase()
      .includes(searchField.toLowerCase())
    );
    setFilteredDetails(filteredProducts);
  }, [searchField, details]);
  const handleSearch = () => {
    if (searchField.trim() !== "") {
      const query = encodeURIComponent(searchField.trim());
      navigate(`/?q=${query}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      setSearchField("");
    }
  };
  const location = window.location.pathname;
  // Remove the leading "/"
  const trimmedPath = location.substring(1);
  // Replace "-" with a space
  const formattedText = trimmedPath.replace(/-/g, " ");

  return (
    <div>
      <div className="flex md:hidden rounded-lg my-3 w-[95%] mx-auto shadow-sm">
        <input
          type="text"
          name="search-input"
          placeholder="What would you like to order today?"
          className="py-3 bg-transparent px-4 block w-full text-[#000] border border-green-900 shadow-sm rounded-s-lg text-sm focus:z-10 outline-none disabled:opacity-50 disabled:pointer-events-none"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="py-3 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-mainGreen text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          Search
        </button>
      </div>
      {searchField && filteredDetails.length > 0 && (
        <Card className="w-full mt-2 h-[20rem] overflow-y-auto absolute z-[700] top-38">
          {filteredDetails?.map((item, index) => (
            <List key={index}>
              <ListItem onClick={() => navigate(`/product/${item._id}`)}>
                <ListItemPrefix>
                  <Avatar
                    variant="circular"
                    alt="candice"
                    src={item?.product_image}
                  />
                </ListItemPrefix>
                <div>
                  <Typography variant="h6" color="blue-gray" className="truncate">
                    {item?.product_name}
                  </Typography>
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-normal"
                  >
                    {item?.product_cat}
                  </Typography>
                </div>
              </ListItem>
            </List>
          ))}
        </Card>
      )}
      <OnboardBanner pageName={formattedText} />
      <main className="px-3 py-5 md:px-14 md:py-12">{children}</main>
    </div>
  );
}
