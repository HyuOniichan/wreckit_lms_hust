(() => {
    const buttonId = "lms-chatbox-button";

    if (document.getElementById(buttonId)) return;

    const chatboxButton = document.createElement("button");
    chatboxButton.id = buttonId;
    chatboxButton.type = "button";
    chatboxButton.setAttribute("aria-label", "Mở chatbox");
    chatboxButton.setAttribute("aria-expanded", "false");
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
        border: "1px solid #1f2937",
        borderRadius: "22px",
        backgroundColor: "#1f2937",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        fontWeight: "700",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
        cursor: "pointer"
    });

    const chatboxPanel = document.createElement("section");
    chatboxPanel.id = "lms-chatbox-panel";
    chatboxPanel.setAttribute("aria-label", "Chatbox");

    Object.assign(chatboxPanel.style, {
        position: "fixed",
        right: "20px",
        bottom: "78px",
        zIndex: "2147483647",
        display: "block",
        visibility: "hidden",
        opacity: "0",
        transform: "translateY(12px) scale(0.97)",
        transformOrigin: "bottom right",
        pointerEvents: "none",
        transition: "opacity 180ms ease, transform 180ms ease, visibility 180ms ease",
        width: "min(300px, calc(100vw - 32px))",
        height: "360px",
        overflow: "hidden",
        boxSizing: "border-box",
        border: "1px solid #dbe3ef",
        borderRadius: "14px",
        backgroundColor: "#ffffff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.2)",
        fontFamily: "Arial, sans-serif"
    });

    const panelHeader = document.createElement("header");
    Object.assign(panelHeader.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 14px 12px 16px",
        borderBottom: "1px solid #e5e7eb"
    });

    const titleGroup = document.createElement("div");
    Object.assign(titleGroup.style, {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    });

    const panelTitle = document.createElement("strong");
    panelTitle.textContent = "Chatbox";
    Object.assign(panelTitle.style, {
        color: "#1f2937",
        fontSize: "16px",
        lineHeight: "1.2"
    });

    const panelStatus = document.createElement("span");
    panelStatus.textContent = "Đang hoạt động";
    Object.assign(panelStatus.style, {
        color: "#64748b",
        fontSize: "11px",
        lineHeight: "1.2"
    });

    titleGroup.appendChild(panelTitle);
    titleGroup.appendChild(panelStatus);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Đóng chatbox");
    closeButton.title = "Đóng chatbox";
    closeButton.textContent = "×";
    Object.assign(closeButton.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        padding: "0",
        border: "0",
        borderRadius: "8px",
        backgroundColor: "transparent",
        color: "#64748b",
        fontSize: "22px",
        lineHeight: "1",
        cursor: "pointer"
    });

    closeButton.addEventListener("mouseenter", () => {
        closeButton.style.backgroundColor = "#f1f5f9";
        closeButton.style.color = "#1f2937";
    });

    closeButton.addEventListener("mouseleave", () => {
        closeButton.style.backgroundColor = "transparent";
        closeButton.style.color = "#64748b";
    });

    panelHeader.appendChild(titleGroup);
    panelHeader.appendChild(closeButton);
    chatboxPanel.appendChild(panelHeader);

    const emptyState = document.createElement("div");
    emptyState.textContent = "Sẵn sàng hỗ trợ bạn trong quá trình làm bài.";
    Object.assign(emptyState.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100% - 66px)",
        padding: "24px",
        boxSizing: "border-box",
        color: "#94a3b8",
        fontSize: "13px",
        lineHeight: "1.5",
        textAlign: "center"
    });
    chatboxPanel.appendChild(emptyState);

    const connector = document.createElement("div");
    connector.setAttribute("aria-hidden", "true");
    Object.assign(connector.style, {
        position: "fixed",
        right: "40px",
        bottom: "54px",
        zIndex: "2147483647",
        display: "flex",
        visibility: "hidden",
        opacity: "0",
        transform: "scale(0.7)",
        transition: "opacity 180ms ease, transform 180ms ease, visibility 180ms ease",
        width: "6px",
        height: "20px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between"
    });

    const dot = document.createElement("span");
    Object.assign(dot.style, {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: "#ffffff",
        boxShadow: "0 0 3px rgba(0, 0, 0, 0.45)"
    });
    connector.appendChild(dot);

    const toggleChatbox = () => {
        const isOpen = chatboxButton.getAttribute("aria-expanded") === "true";
        const nextState = !isOpen;

        chatboxPanel.style.visibility = nextState ? "visible" : "hidden";
        chatboxPanel.style.opacity = nextState ? "1" : "0";
        chatboxPanel.style.transform = nextState
            ? "translateY(0) scale(1)"
            : "translateY(12px) scale(0.97)";
        chatboxPanel.style.pointerEvents = nextState ? "auto" : "none";

        connector.style.visibility = nextState ? "visible" : "hidden";
        connector.style.opacity = nextState ? "1" : "0";
        connector.style.transform = nextState ? "scale(1)" : "scale(0.7)";

        chatboxButton.setAttribute("aria-expanded", String(nextState));
        chatboxButton.setAttribute("aria-label", nextState ? "Đóng chatbox" : "Mở chatbox");
        chatboxButton.title = nextState ? "Đóng chatbox" : "Mở chatbox";
    };

    chatboxButton.addEventListener("click", toggleChatbox);
    closeButton.addEventListener("click", toggleChatbox);

    chatboxButton.addEventListener("mouseenter", () => {
        chatboxButton.style.backgroundColor = "#374151";
    });

    chatboxButton.addEventListener("mouseleave", () => {
        chatboxButton.style.backgroundColor = "#1f2937";
    });

    document.documentElement.appendChild(chatboxPanel);
    document.documentElement.appendChild(connector);
    document.documentElement.appendChild(chatboxButton);
})();
