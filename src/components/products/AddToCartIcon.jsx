import { BsFillBasketFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

const AddToCartIcon = ({
  isSelected = false,
  isLoading = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={isSelected ? "Remove from cart" : "Add to cart"}
      className={[
        "flex items-center justify-center w-9 h-9 rounded-full",
        "transition-all duration-200 ease-in-out",
        "shadow-md",
        isSelected ? "bg-[#0F8128]" : "bg-[#D9D9D9]",
        !disabled && "hover:scale-110 active:scale-95",
        disabled && "opacity-40 cursor-not-allowed",
        isLoading && "animate-pulse",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isSelected ? (
        <IoClose className="w-[18px] h-[18px] text-white transition-colors duration-200" />
      ) : (
        <BsFillBasketFill className="w-[18px] h-[18px] text-[#0F8128] transition-colors duration-200" />
      )}
    </button>
  );
};

export default AddToCartIcon;
