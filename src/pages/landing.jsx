import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { truncateString } from "../lib/util/truncateString";
import { setCarte } from "../redux/cart";
import { TabsWithIcon } from "../components/molecule/tabs/tab";
import TabItem from "../components/landingSection/tabItem";
import { Helmet } from "react-helmet-async";
import { Loader } from "../components/molecule/loader/tabLoader";
import { FooterWithSitemap } from "../components/common/footer/footer.jsx";
import LandingAds from "../components/ads/LandingAds.jsx";
import SearchBar from "../components/common/search/SearchBar.jsx";

const Landing = () => {
  const { user } = useSelector((state) => state.user);
  const [categories, setCategories] = useState(["Most Recent"]);
  const [activeTab, setActiveTab] = useState("Most-Recent");
  const [activeTabValue, setActiveTabValue] = useState("Most-Recent");
  const [carter, setCarter] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchField, setSearchField] = useState("");
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);

  let baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}category/get`);
        const fetchedCategories = response.data.agriculturalCategories.map(
          (category) => category.category,
        );
        const newCategories = ["Most-Recent", ...fetchedCategories];
        setCategories(newCategories);
        setActiveTab(newCategories[0].replace(/\s/g, "%20")); // Set the initial active tab value
      } catch (error) {
        // toast.error("Error fetching product:", error);
      }
    };

    fetchData();
  }, [baseUrl]);

  const categoryQueryParam = categories.map((category) =>
    category.replace(/\s/g, "%20"),
  );
  const handleTabClick = (value) => {
    setActiveTab(value);
    setActiveTabValue(value);
  };
  useEffect(() => {
    let userId = localStorage.getItem("userId");
    let baseUrl = import.meta.env.VITE_BASE_URL;
    if (userId !== null) {
      axios.get(`${baseUrl}cart/get/${userId}`).then((response) => {
        if (response.data) {
          setCarter(response.data.cart);
          dispatch(setCarte(response.data.cart));
        }
      });
    }
    axios.get(`${baseUrl}product`).then((response) => {
      if (response.data) {
        setDetails(response.data.products);
        setFilteredDetails(response.data.products); // Initialize filteredDetails with all products
      }
    });
  }, [dispatch]);

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
          .includes(searchField.toLowerCase()),
    );
    setFilteredDetails(filteredProducts);
  }, [searchField, details]);
  const handleSearch = () => {
    if (searchField.trim() !== "") {
      const query = encodeURIComponent(searchField.trim());
      navigate(`/our-store?q=${query}`);
    }
  };

  

  const data = categories.map((category) => ({
    label: category,
    value: categoryQueryParam[categories.indexOf(category)],
    desc: <TabItem category={activeTab} carter={carter} />,
  }));

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Helmet>
          <title>Nushopa</title>
          <meta
            name="description"
            content="Nushopa - Your one-stop destination for fresh, locally-sourced farm produce delivered straight to your doorstep. Explore a variety of organic fruits, vegetables, and more!"
          />
        </Helmet>

        <LandingAds />
        <div className="hidden flex my-3 w-[95%] mx-auto">
          <SearchBar
            placeholder="What would you like to order today?"
            value={searchField}
            onChange={setSearchField}
            onSearch={handleSearch}
            className="w-full [&_input]:text-black [&_input]:bg-white [&_input]:border-green-900 [&_input]:border [&_input]:rounded-none [&_input]:rounded-l-lg [&_button]:bg-mainGreen [&_button]:hover:bg-green-700 [&_button]:rounded-none [&_button]:rounded-r-lg [&_button]:border-0"
          />
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

        <main className="px-2 md:px-11">
          <TabsWithIcon
            data={data}
            activeTabValue={activeTabValue}
            handleTabClick={handleTabClick}
          />
        </main>
        {/* <DialogDefault open={openDialog} handler={handleDialogClose}/> */}
      </Suspense>

      {!user?._id ? <FooterWithSitemap /> : null}
    </>
  );
};
export default Landing;