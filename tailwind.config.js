export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false, // 🔥 ESSA LINHA
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
