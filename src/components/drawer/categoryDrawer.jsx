import { Drawer } from "@material-tailwind/react";
import { FiCheck, FiX } from "react-icons/fi";

export default function CategoryDrawer({ open, closeDrawer, categories, selectedCategories, handleCategoryToggle }) {
  return (
    <Drawer open={open} onClose={closeDrawer} className="p-4 block md:hidden">
      <div className="mr-4 bg-white w-full md:w-[25%] md:h-[20rem] h-screen overflow-y-auto p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-800">Categories</h3>
          <button
            onClick={closeDrawer}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

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
                  {isActive && <FiCheck size={16} className="text-mainGreen" strokeWidth={2.5} />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Drawer>
  );
}