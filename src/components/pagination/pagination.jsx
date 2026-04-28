import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function CircularPagination({ currentPage, totalPages, onPageChange }) {
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // Add the first page
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    // Add the range around the current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add the last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex w-full items-center justify-center gap-2 sm:gap-4">
      <Button
        variant="text"
        className="flex items-center text-mainGreen gap-1 sm:gap-2 rounded-full px-2 sm:px-4 text-xs sm:text-sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-3 w-3 sm:h-4 sm:w-4 bg" /> Previous
      </Button>
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
        {generatePageNumbers().map((page, index) => (
          <IconButton
            key={index}
            variant={page === currentPage ? "filled" : "text"}
            size="sm"
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`${page === currentPage ? "bg-mainGreen rounded-lg w-6 h-6 sm:w-8 sm:h-8  text-xs sm:text-sm" : "rounded-full w-6 h-6 sm:w-8 sm:h-8  text-xs sm:text-sm"}`}
          >
            {page}
          </IconButton>
        ))}
      </div>
      <Button
        variant="text"
        className="flex items-center text-mainGreen gap-1 sm:gap-2 rounded-full px-2 sm:px-4 text-xs sm:text-sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
}
