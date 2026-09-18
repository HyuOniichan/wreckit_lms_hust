(() => {
    const buttonId = "lms-chatbox-button";
    const groqEndpoint = "https://api.groq.com/openai/v1/chat/completions";
    const groqModel = "groq/compound";

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
        display: "flex",
        flexDirection: "column",
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

    const messages = document.createElement("div");
    messages.setAttribute("aria-live", "polite");
    Object.assign(messages.style, {
        flex: "1",
        minHeight: "0",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "14px",
        boxSizing: "border-box",
        backgroundColor: "#f8fafc"
    });

    const emptyState = document.createElement("div");
    emptyState.textContent = "Sẵn sàng hỗ trợ bạn trong quá trình làm bài.";
    Object.assign(emptyState.style, {
        margin: "auto",
        color: "#94a3b8",
        fontSize: "13px",
        lineHeight: "1.5",
        textAlign: "center"
    });
    messages.appendChild(emptyState);
    chatboxPanel.appendChild(messages);

    const messageForm = document.createElement("form");
    Object.assign(messageForm.style, {
        display: "flex",
        gap: "8px",
        padding: "10px",
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#ffffff"
    });

    const messageInput = document.createElement("textarea");
    messageInput.rows = 1;
    messageInput.placeholder = "Nhập tin nhắn...";
    messageInput.setAttribute("aria-label", "Tin nhắn");
    Object.assign(messageInput.style, {
        flex: "1",
        minWidth: "0",
        minHeight: "36px",
        maxHeight: "80px",
        resize: "none",
        padding: "9px 10px",
        boxSizing: "border-box",
        border: "1px solid #cbd5e1",
        borderRadius: "9px",
        outline: "none",
        color: "#1f2937",
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        lineHeight: "1.35"
    });

    const sendButton = document.createElement("button");
    sendButton.type = "submit";
    sendButton.textContent = "Gửi";
    sendButton.setAttribute("aria-label", "Gửi tin nhắn");
    Object.assign(sendButton.style, {
        alignSelf: "stretch",
        padding: "0 12px",
        border: "0",
        borderRadius: "9px",
        backgroundColor: "#1f2937",
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer"
    });

    const conversation = [];

    const addMessage = (text, sender = "user") => {
        if (emptyState.isConnected) emptyState.remove();

        const message = document.createElement("div");
        message.textContent = text;
        Object.assign(message.style, {
            alignSelf: sender === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
            padding: "8px 10px",
            borderRadius: sender === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
            backgroundColor: sender === "user" ? "#1f2937" : "#e2e8f0",
            color: sender === "user" ? "#ffffff" : "#1f2937",
            fontSize: "13px",
            lineHeight: "1.4",
            overflowWrap: "anywhere"
        });

        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
        return message;
    };

    const requestGroqResponse = async () => {
        const { groqApiKey } = await chrome.storage.local.get("groqApiKey");

        if (!groqApiKey) {
            throw new Error("Chưa cấu hình Groq API key trong chrome.storage.local.");
        }

        const response = await fetch(groqEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
                model: groqModel,
                messages: [
                    {
                        role: "system",
                        content: "Bạn là trợ lý học tập ngắn gọn, hữu ích và trả lời bằng tiếng Việt nếu người dùng hỏi bằng tiếng Việt."
                    },
                    ...conversation
                ],
                temperature: 0.4,
                max_tokens: 700
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || `Groq API error: ${response.status}`);
        }

        return data.choices?.[0]?.message?.content?.trim() || "Mình chưa có câu trả lời cho câu hỏi này.";
    };

    messageForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const text = messageInput.value.trim();

        if (!text) return;

        addMessage(text);
        conversation.push({ role: "user", content: text });
        messageInput.value = "";
        messageInput.disabled = true;
        sendButton.disabled = true;
        sendButton.textContent = "...";

        const loadingMessage = addMessage("Đang trả lời...", "assistant");

        try {
            const answer = await requestGroqResponse();
            loadingMessage.textContent = answer;
            conversation.push({ role: "assistant", content: answer });
        } catch (error) {
            loadingMessage.textContent = `Không thể nhận phản hồi: ${error.message}`;
            loadingMessage.style.color = "#b91c1c";
            console.error("Groq request failed:", error);
        } finally {
            messageInput.disabled = false;
            sendButton.disabled = false;
            sendButton.textContent = "Gửi";
        }

        messageInput.focus();
    });

    messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            messageForm.requestSubmit();
        }
    });

    messageForm.appendChild(messageInput);
    messageForm.appendChild(sendButton);
    chatboxPanel.appendChild(messageForm);

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
