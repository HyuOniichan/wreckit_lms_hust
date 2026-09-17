(() => {
    const buttonId = "lms-chatbox-button";

    if (document.getElementById(buttonId)) return;

    const chatboxButton = document.createElement("button");
    chatboxButton.id = buttonId;
    chatboxButton.type = "button";
    chatboxButton.setAttribute("aria-label", "Mở chatbox");
    chatboxButton.title = "Mở chatbox";
    chatboxButton.textContent = "Chat";

    Object.assign(chatboxButton.style, {
        position: "fixed",
        right: "20px",
        bottom: "20px",
        zIndex: "2147483647",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "64px",
        height: "44px",
        padding: "0",
        border: "0",
        borderRadius: "22px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        fontWeight: "700",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
        cursor: "pointer"
    });

    chatboxButton.addEventListener("mouseenter", () => {
        chatboxButton.style.backgroundColor = "#1d4ed8";
    });

    chatboxButton.addEventListener("mouseleave", () => {
        chatboxButton.style.backgroundColor = "#2563eb";
    });

    document.documentElement.appendChild(chatboxButton);
})();
