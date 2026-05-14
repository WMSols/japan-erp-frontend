// tailwind.config.ts
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    // make sure this covers wherever you placed the workshop files
    "./src/**/*.{ts,tsx}", // if you use a src/ dir
  ],
  // ...
}