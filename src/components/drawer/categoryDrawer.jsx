import { Drawer } from "@material-tailwind/react";

export default function CategoryDrawer({ open, closeDrawer, categories, selectedCategories, handleCategoryToggle }) {
  return (
    <Drawer open={open} onClose={closeDrawer} className="p-4 block md:hidden">
      <div className="mr-4 bg-white w-full md:w-[25%] md:h-[20rem] h-screen overflow-x-auto p-4 rounded-lg">
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
                  className={selectedCategories.includes(category) ? "text-mainGreen font-bold" : ""}
                >
                  {category}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </Drawer>
  )
}
