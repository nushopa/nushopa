import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Avatar,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { truncateString } from "../lib/util/truncateString";
import SearchBar from "../components/common/search/SearchBar";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchField, setSearchField] = useState("");
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Fetch all products once for the autocomplete dropdown
  useEffect(() => {
    axios.get(`${baseUrl}product`).then((response) => {
      if (response.data) {
        setDetails(response.data.products);
      }
    });
  }, [baseUrl]);

  // Sync search input with URL query param so it clears when navigating away
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    setSearchField(query);
  }, [location.search]);

  useEffect(() => {
    const trimmed = searchField.trim();
    if (trimmed) {
      navigate(`/?q=${encodeURIComponent(trimmed)}`, { replace: true });
    } else {
      // Clear the query param when search is emptied
      const params = new URLSearchParams(location.search);
      if (params.get("q")) {
        navigate("/", { replace: true });
      }
    }
  }, [searchField]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    clearTimeout(debounceTimer.current);

    if (!searchField.trim()) {
      setFilteredDetails([]);
      setShowDropdown(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      const lower = searchField.toLowerCase();
      const filtered = details.filter(
        (product) =>
          product.product_name.toLowerCase().includes(lower) ||
          product.product_cat.toLowerCase().includes(lower) ||
          product.product_brand_name.toLowerCase().includes(lower) ||
          product.product_sub_cat.toLowerCase().includes(lower),
      );
      setFilteredDetails(filtered);
      setShowDropdown(filtered.length > 0);
    }, 300); 

    return () => clearTimeout(debounceTimer.current);
  }, [searchField, details]);

  const handleSearch = () => {
    if (searchField.trim()) {
      const query = encodeURIComponent(searchField.trim());
      setShowDropdown(false);
      navigate(`/?q=${query}`);
    }
  };

  const handleProductClick = (productId) => {
    setShowDropdown(false);
    setSearchField("");
    navigate(`/product/${productId}`);
  };

  return (
    <div>
      {/* Mobile search bar — hidden on md+ (desktop uses the header's SearchBar) */}
      <div className="flex md:hidden my-3 w-[95%] mx-auto relative">
        <SearchBar
          placeholder="What would you like to order today?"
          value={searchField}
          onChange={setSearchField}
          onSearch={handleSearch}
          className="w-full [&_input]:text-black [&_input]:bg-white [&_input]:border-green-900 [&_input]:border [&_input]:rounded-none [&_input]:rounded-l-lg [&_button]:bg-mainGreen [&_button]:hover:bg-green-700 [&_button]:rounded-none [&_button]:rounded-r-lg [&_button]:border-0"
        />

        {/* Autocomplete dropdown — mobile */}
        {showDropdown && (
          <Card className="absolute top-full left-0 right-0 mt-1 max-h-[20rem] overflow-y-auto z-[700] shadow-lg">
            {filteredDetails.map((item, index) => (
              <List key={index}>
                <ListItem onClick={() => handleProductClick(item._id)}>
                  <ListItemPrefix>
                    <Avatar
                      variant="circular"
                      alt={item?.product_name}
                      src={item?.product_image}
                    />
                  </ListItemPrefix>
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      {truncateString(item?.product_name, 18)}
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
      </div>

      <main className="px-3 py-5 md:px-14 md:py-12">{children}</main>
    </div>
  );
}