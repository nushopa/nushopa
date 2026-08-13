import { useState, useEffect } from "react";
import axios from "axios";
import { FiCheck } from "react-icons/fi";

export default function CategoryMenu({
  baseUrl,
  selectedCategories,
  handleCategoryToggle,
  onCategoriesLoaded,
}) {
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}category/get`);
        const fetchedCategories = response.data.agriculturalCategories.map(
          (category) => category.category,
        );
        const updatedCategories = ["All", ...fetchedCategories];
        setCategories(updatedCategories);
        onCategoriesLoaded?.(updatedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [baseUrl, onCategoriesLoaded]);

  return (
    <div className="hidden md:block mr-4 bg-white w-full md:w-[25%] sticky top-28 h-full overflow-x-auto p-4 rounded-lg">
      <h3 className="mb-4 font-bold">Categories</h3>
      <ul className="space-y-2">
        {categories.map((category, index) => {
          const isActive = selectedCategories.includes(category);
          return (
            <li key={index}>
              <button
                onClick={() => handleCategoryToggle(category)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm transition-colors duration-150 ${
                  isActive
                    ? "bg-mainGreen/10 border-mainGreen text-mainGreen font-semibold"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                <span>{category}</span>
                {isActive && (
                  <FiCheck
                    size={16}
                    className="text-mainGreen"
                    strokeWidth={2.5}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
