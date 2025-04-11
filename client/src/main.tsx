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
    @apply bg-primary hover:bg-green-700 active:bg-green-800;
  }
  .btn-success {
    @apply bg-[#4CAF50] hover:bg-green-600 active:bg-green-700;
  }
  .card {
    @apply bg-white rounded-lg shadow-md p-4 mb-4;
  }
  .page-container {
    @apply w-full;
  }
  .nav-item {
    @apply flex flex-col items-center justify-center px-2 py-3;
  }
  .nav-item.active {
    @apply text-primary bg-green-50 border-t-2 border-primary;
  }
  .nav-item .material-icons {
    @apply text-xl mb-1;
  }
  .syncing-status {
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
  .summary-card {
    @apply bg-white rounded-lg p-3 shadow-md flex items-center justify-between mb-3;
  }
  .summary-card-icon {
    @apply text-primary bg-green-50 rounded-full p-2;
  }
  .action-button {
    @apply bg-primary text-white font-medium px-4 py-2 rounded-lg flex items-center justify-center;
  }
  .action-button .material-icons {
    @apply mr-2 text-sm;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
