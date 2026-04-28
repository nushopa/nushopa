
const Breadcrumb = ({ categories }) => {
  return (
    <ol className="flex items-center whitespace-nowrap" aria-label="Breadcrumb">
      <li className="inline-flex items-center">
        <a
          className="flex items-center text-sm text-mainGreen hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:focus:text-blue-500"
          href="/"
        >
          Home
        </a>
        <svg
          className="flex-shrink-0 mx-2 overflow-visible h-4 w-4 text-gray-400 dark:text-neutral-600 dark:text-neutral-600"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </li>
      <li className="inline-flex items-center">
        <a
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:focus:text-blue-500"
          href="/"
        >
          {categories}
          <svg
            className="flex-shrink-0 mx-2 overflow-visible h-4 w-4 text-gray-400 dark:text-neutral-600 dark:text-neutral-600"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </a>
      </li>
    </ol>
  );
};
 
export default Breadcrumb;