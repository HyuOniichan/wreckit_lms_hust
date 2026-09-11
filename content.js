console.log("Extension loaded");


function normalize(str) {
	return str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "D")
		.replace(/[\r\n]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}



function getQuestion() {
	const question = document.querySelector(".que.multichoice.deferredfeedback")
		.childNodes[1].childNodes[0].childNodes[2].innerText;

	return question;
}



function findAnswer(question) {
	const key = normalize(question);

	for (const [q, answer] of Object.entries(ANSWERS)) {
		if (normalize(q) === key) return answer;
	}

	return "";
}



function highlightAnswer(answerText) {
    const questionElement = document.querySelector(".que.multichoice.deferredfeedback");

    if (!questionElement) {
        console.log("Không tìm thấy question");
        return false;
    }

    const answerContainer = questionElement.childNodes[1].childNodes[0].childNodes[3].childNodes[1];

    for (const option of answerContainer.children) {
		const answerElement = option.children[1];
		if (!answerElement) continue;

        const text = answerElement.innerText;
        console.log("Checking option:", normalize(text));
        console.log("Correct answer:", normalize(answerText));

        if (normalize(text).slice(3) == normalize(answerText)) {
            answerElement.style.backgroundColor = "#fdff32";
            answerElement.style.padding = "1px 5px";

            console.log("Đã highlight:", text);
            return true;
        }
    }

    console.log("Không tìm thấy đáp án:", answerText);
    return false;
}






function handleShowAnswer() {
    const question = getQuestion();
    const answer = findAnswer(question);

    if (!answer) {
        console.log("Answer not found");
        return;
    }

    highlightAnswer(answer);
}



// --- Message from popup

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "showAnswer") {
        handleShowAnswer();
    }
});



// --- Hotkeys

document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() == "s") {
		// Skip if holding Ctrl / Alt / Meta
		if (event.ctrlKey || event.altKey || event.metaKey) return;
	
		// Skip while texting
		const target = event.target;
	
		if (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target instanceof HTMLSelectElement ||
			target.isContentEditable
		) {
			return;
		}
	
		console.log("HOTKEY S -> SHOW ANSWER");
		handleShowAnswer();
    }
});

