import React from "react";
import ReactDOM from "react-dom/client";
import AdminPanel from "./components/AdminPanel.jsx";

// Ensure root element exists
const rootElement = document.getElementById("root");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <AdminPanel />
        </React.StrictMode>
    );
} else {
    console.error("Root element not found. Ensure admin.html has <div id='root'></div>");
}
