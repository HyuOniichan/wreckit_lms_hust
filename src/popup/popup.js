chrome.tabs.query(
    { active: true, currentWindow: true },
    ([tab]) => {
        chrome.tabs.sendMessage(tab.id, {
            action: "showAnswer"
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
            const result = await validateLicense(licenseKey);

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



updateStatus();
