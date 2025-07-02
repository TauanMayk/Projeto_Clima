import "./themetoggler.css";

export const ThemeToggler = () => {
  return (
    <>
      <button className="Icones text-2xl transition-transform duration-700 ease-in-out hover:scale-125 opacity-[0.90] w-20 h-20 absolute top-4">
        <img
          className="btn-theme cursor-pointer bg-[#76456456] p-2 rounded-md w-20 h-20 "
          onClick={() => document.body.classList.toggle("dark:bg-gray-800")}
          srcSet="public/images/free-sun-icon-3337-thumb.png"
          title="Botão Theme-toggler"
        ></img>
      </button>
    </>
  );
};
