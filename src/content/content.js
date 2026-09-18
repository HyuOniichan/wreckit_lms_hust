console.log("Extension loaded");



function queryQuestion() {
	const questionElement = document.querySelector(".que.multichoice.deferredfeedback");
	const question = questionElement?.childNodes[1]?.childNodes[0]?.childNodes[2]?.innerText;

	return question;
}



function queryCurrentCourse() {
	const currentCourse = document.querySelector(".breadcrumb")?.children[0]?.innerText;
	return currentCourse;
}



function queryCurrentTab() {
	const currentTab = document.querySelector(".page-context-header")?.innerText;
	return currentTab;
}


	
function queryQuizReviewTable() {
	const table = document.querySelector(".generaltable").children[1];

	if (!table) {
		console.log("Review Quiz table not found");
		return;
	}

	const keyValuePairs = [...table.children].map(element => {
		const k = element.children[0].innerText;
		const v = element.children[1].innerText;
		return [k, v];
	});

	const tableObject = Object.fromEntries(keyValuePairs);
	return tableObject;
}



function queryQuizReviewQuestions() {
	const questions = document.querySelectorAll(".que.multichoice.deferredfeedback");

	if (!questions) {
		console.log("Review Quiz questions not found");
		return;
	}

	const quizQuestions = [...questions].map((question, questionIndex) => {
		const questionText = question.children[1].children[0].children[2].innerText;
		const correctAnswerText = question.children[1].children[1].children[1].innerText.slice(23);

		const correctAnswers = [];
		const answerOptions = question.children[1].children[0].children[3].children[1].children;

		const answerMap = Object.fromEntries([...answerOptions].map(ans => {
			if (ans.innerText.slice(4) == correctAnswerText) {
				correctAnswers.push(ans.innerText.slice(0, 1).toUpperCase());
			}
			return [ans.innerText.slice(0, 1).toUpperCase(), ans.innerText.slice(4)];
		}
		));

		const questionObject = {
			id: `q${String(questionIndex + 1).padStart(3, '0')}`,
			text: questionText,
			normalizedText: normalize(questionText),
			answers: answerMap,
			correctAnswers: correctAnswers
		};

		return questionObject;
	})

	return JSON.stringify(quizQuestions);
}



// --- Debug

// console.log(normalizeId(queryCurrentCourse()))
// console.log(normalizeId(queryCurrentTab()))
// console.log(queryQuizReviewTable())
// console.log(queryQuizReviewQuestions())


// async function testFirebase() {
// 	const questions = await getQuizQuestions(
// 		"bl-it3180-172879",
// 		"quiz-0101"
// 	);

// 	console.log("FIREBASE TEST:");
// 	console.log(questions);
// }

// testFirebase();



// --- Logic

async function checkLicense() {
	const result = await chrome.storage.local.get(["licenseKey", "licenseInfo"]);

	if (!result.licenseKey || !result.licenseInfo) return false;
	if (!result.licenseInfo.valid) return false;
	return true;
}



async function handleShowAnswer() {
	try {
		const licensed = await checkLicense();

		if (!licensed) {
			console.log("License invalid. Cannot show answer.");
			return;
		}

		const question = queryQuestion();
		const courseName = queryCurrentCourse();
		const quizName = queryCurrentTab();

		if (!question || !courseName || !quizName) {
			console.log("Quiz question not found on this page.");
			return;
		}

		const courseId = normalizeId(courseName);
		const quizId = normalizeId(quizName);

		const questions = await getQuizQuestions(courseId, quizId);
		const questionData = findQuestion(questions, question);

		if (!questionData) {
			console.log("Question not found: ", question);
			console.log("Questions: ", questions);
			return;
		}

		const correctAnswers = questionData.correctAnswers;

		for (const answerKey of correctAnswers) {
			const answerText = questionData.answers[answerKey];
			if (answerText) {
				handleHighlightAnswer(answerText);
			}
		}
	} catch (error) {
		console.error("Failed to show answer:", error);
	}
}



function handleHighlightAnswer(answerText) {
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

		if (normalize(text).slice(3) == normalize(answerText)) {
			answerElement.style.backgroundColor = "#fdff32";
			answerElement.style.padding = "1px 5px";

			return true;
		}
	}

	console.log("Không tìm thấy đáp án:", answerText);
	return false;
}



// --- Message from popup

chrome.runtime.onMessage.addListener((message) => {
	if (message.action === "showAnswer") {
		handleShowAnswer();
	}
});



// --- Hotkeys

document.addEventListener("keydown", async (event) => {
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

