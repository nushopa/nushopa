import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "greenWhite": "#EFFDF0",
        "description": "#7B7B7B",
        "mainGreen": "#007145",
        "lightGreen": "#EFFDF0",
        "mainOrange": "#e65100",
        "shipped": "#2196f3",
      },
      fontFamily: {
        workSans: ["Noto Sans", 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        errorFont: ["Neonderthaw", "cursive"],
      },
    },
  },
  plugins: [],
});
