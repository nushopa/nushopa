import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  placeholder = "Search products by name, category, brand...",
  value,
  onChange,
  onSearch,                   
  suggestions = [],
  onSelectSuggestion,
  className = "",
  showSuggestions = true,      
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shouldShowSuggestions = isFocused && value?.trim() && suggestions.length > 0 && showSuggestions;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch?.(value);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (item) => {
    onSelectSuggestion?.(item);
    setIsFocused(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      <div className="flex rounded-lg shadow-sm border border-green-800 overflow-hidden">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="py-2 px-4 flex-1 bg-white/10 w-[25rem] text-white placeholder:text-green-200 border-none focus:outline-none"
          aria-label={placeholder}
        />
        <button
          onClick={() => onSearch?.(value)}
          className="px-5 bg-white/20 hover:bg-white/30 text-white transition flex items-center gap-2"
          aria-label="Search"
        >
          <FaSearch className="text-sm" />
        </button>
      </div>

      {/* Live Suggestions Dropdown */}
      {shouldShowSuggestions && (
        <div className="absolute z-[1000] w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[300px] overflow-y-auto py-2">
          {suggestions.map((item, index) => (
            <div
              key={item._id || index}
              onClick={() => handleSuggestionClick(item)}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b last:border-b-0"
            >
              <img
                src={item.product_image}
                alt={item.product_name}
                className="w-10 h-10 object-cover rounded-md"
              />
              <div>
                <p className="font-medium text-gray-900 line-clamp-1">
                  {item.product_name}
                </p>
                <p className="text-sm text-gray-500">{item.product_cat}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;