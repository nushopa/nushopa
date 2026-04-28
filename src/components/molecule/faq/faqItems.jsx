const FaqItem = ({ list, handleClick, isOpen, index }) => {
  return (
    <div className="pt-4 ">
      <div className="overflow-hidden w-full text-[#000] flex flex-col justify-center items-center">
        <div
          onClick={() => handleClick(index)}
          className="flex justify-between cursor-pointer items-center bg-white px-4 py-2 w-[95%] md:w-[80%] "
        >
          <p className="text-md md:text-[1.5rem] w-[80%] md:w-full">{list.question}</p>
          <button className="text-[#000] text-[2rem]">
            {isOpen[index] ? "-" : "+"}
          </button>
        </div>
        {isOpen[index] ? (
          <p className="text-md md:text-[1.4rem] bg-white p-4 w-[95%] md:w-[80%] border-t-2 border-mainGreen ">
            {list.answer}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default FaqItem;
