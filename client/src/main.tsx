import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global styles for the app
const style = document.createElement("style");
style.textContent = `
  .input-field {
    @apply w-full px-4 py-3 rounded-lg border border-[#e0e0e0] bg-white text-[#424242] focus:outline-none focus:ring-2 focus:ring-primary;
  }
  .btn {
    @apply px-6 py-3 rounded-lg font-medium text-white transition duration-150 shadow-md;
  }
  .btn-primary {
    @apply bg-primary hover:bg-blue-700 active:bg-blue-800;
  }
  .btn-success {
    @apply bg-[#4CAF50] hover:bg-green-600 active:bg-green-700;
  }
  .card {
    @apply bg-white rounded-lg shadow-md p-4 mb-4;
  }
  .page-container {
    @apply max-w-md mx-auto p-4 pb-24;
  }
  .nav-item {
    @apply flex flex-col items-center justify-center px-3 py-2 rounded-lg;
  }
  .nav-item.active {
    @apply text-primary bg-blue-50;
  }
  .syncing-status {
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
