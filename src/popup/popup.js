chrome.tabs.query(
    { active: true, currentWindow: true },
    ([tab]) => {
        if (!tab?.id) return;

        chrome.tabs.sendMessage(tab.id, {
            action: "showAnswer"
        }).catch(() => {
            // The content script is unavailable outside LMS pages.
        });
    }
);



async function updateStatus() {
    const result = await chrome.storage.local.get(["licenseKey", "licenseInfo"]);
    const status = document.getElementById("status");

    if (!result.licenseKey || !result.licenseInfo) {
        status.innerText = "Chưa kích hoạt license.";
        return;
    }

    const info = result.licenseInfo;

    if (info.valid) {
        status.innerText = `Activated\nMSSV: ${info.userId}\nExpires: ${info.expiresAt || "Không giới hạn"}`;
    } else {
        status.innerText = "License không hợp lệ.";
    }
}

async function updateGroqStatus() {
    const result = await chrome.storage.local.get("groqApiKey");
    const input = document.getElementById("groqApiKeyInput");
    const status = document.getElementById("groqStatus");

    if (result.groqApiKey) {
        input.value = result.groqApiKey;
        status.innerText = "Đã lưu Groq API key.";
    }
}



document
    .getElementById("activateButton")
    .addEventListener("click", async () => {

        const input = document.getElementById("licenseInput");
        const licenseKey = input.value.trim();

        const status = document.getElementById("status");

        if (!licenseKey) {
            status.innerText = "Hãy nhập License Key.";
            return;
        }

        status.innerText = "Đang kiểm tra...";

        try {
            const result = await globalThis.validateLicense(licenseKey);

            if (!result.valid) {
                status.innerText = `License không hợp lệ: ${result.reason}`;
                return;
            }

            await chrome.storage.local.set({
                licenseKey: licenseKey.toUpperCase(),
                licenseInfo: result
            });

            status.innerText = `Activated\nMSSV: ${result.userId}`;

        } catch (error) {
            console.error(error);
            status.innerText = "Không thể kiểm tra license.";
        }
    });

document
    .getElementById("deactivateButton")
    .addEventListener("click", async () => {
        await chrome.storage.local.remove(["licenseKey", "licenseInfo"]);
        document.getElementById("status").innerText = "Đã deactivate.";
    });

document
    .getElementById("saveGroqApiKeyButton")
    .addEventListener("click", async () => {
        const input = document.getElementById("groqApiKeyInput");
        const status = document.getElementById("groqStatus");
        const groqApiKey = input.value.trim();

        if (!groqApiKey) {
            status.innerText = "Hãy nhập Groq API key.";
            return;
        }

        await chrome.storage.local.set({ groqApiKey });
        status.innerText = "Đã lưu Groq API key.";
    });



updateStatus();
updateGroqStatus();
