const FIREBASE_PROJECT_ID = "wreckit-lms-hust";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;



function parseFirestoreValue(value) {
    if ("stringValue" in value) return value.stringValue;
    if ("integerValue" in value) return Number(value.integerValue);
    if ("doubleValue" in value) return value.doubleValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("nullValue" in value) return null;

    if ("arrayValue" in value) 
        return (value.arrayValue.values || []).map(parseFirestoreValue);

    if ("mapValue" in value) {
        const fields = value.mapValue.fields || {};

        return Object.fromEntries(
            Object.entries(fields).map(([key, value]) => [
                key,
                parseFirestoreValue(value)
            ])
        );
    }

    return undefined;
}



function parseFirestoreDocument(document) {
    const fields = document.fields || {};

    return Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [
            key,
            parseFirestoreValue(value)
        ])
    );
}



async function getQuizQuestions(courseId, quizId) {
    const url = `${FIRESTORE_BASE_URL}/courses/${courseId}/quizzes/${quizId}/questions`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Firestore error: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();
    return (data.documents || []).map(parseFirestoreDocument);
}

