/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        doxa: {
          crimson: "#941A45",
          rose: "#B83060",
          blush: "#D05080",
          petal: "#F9E0EA",
          "petal-deep": "#F0C8D8",
          indigo: "#3758A7",
          periwinkle: "#5D78C7",
          mist: "#B5C7F0",
          sky: "#EEF2FF",
          cream: "#FAF0E8",
          "warm-white": "#FAFAFA",
          noir: "#1A0A12",
          slate: "#555555",
          muted: "#888888",
          border: "#DDDDDD",
          "border-light": "#EEEEEE",
          surface: "#F5F5F5",
        },
      },
      width: {
        container: "min(1200px, calc(100% - 40px))",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #3758A7 0%, #941A45 100%)",
        "doxa-petal-gradient": "linear-gradient(135deg, #F9E0EA 0%, #FAF0E8 100%)",
        "review-gradient": "linear-gradient(135deg, rgba(55,88,167,0.28), rgba(148,26,69,0.36)), #1A0A12",
        "editorial-gradient": "linear-gradient(135deg, rgba(55,88,167,0.5), rgba(148,26,69,0.78)), #1A0A12",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Raleway", "DM Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        doxa: "0 8px 28px rgba(26,10,18,0.12)",
        "doxa-xl": "0 16px 48px rgba(26,10,18,0.16)",
        brand: "0 8px 32px rgba(148,26,69,0.22)",
        "brand-lg": "0 16px 56px rgba(148,26,69,0.28)",
      },
      borderRadius: {
        doxa: "8px",
      },
      keyframes: {
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        softZoom: {
          "100%": { transform: "scale(1.09)" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        reveal: "revealUp 0.8s ease forwards",
        "soft-zoom": "softZoom 9s ease-in-out infinite alternate",
        float: "floatY 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
