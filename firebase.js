const FIREBASE_PROJECT_ID = "wreckit-lms-hust";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;



function parseFirestoreValue(value) {
    if ("stringValue" in value) return value.stringValue;
    if ("integerValue" in value) return Number(value.integerValue);
    if ("doubleValue" in value) return value.doubleValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("nullValue" in value) return null;

    if ("timestampValue" in value) 
        return new Date(value.timestampValue);

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



async function validateLicense(licenseKey) {
    const normalizedKey = licenseKey.trim().toUpperCase();

    if (!normalizedKey) {
        return {
            valid: false,
            reason: "empty"
        }
    }

    const url = `${FIRESTORE_BASE_URL}/licenses/${encodeURIComponent(normalizedKey)}`;
    const response = await fetch(url);

    if (response.status === 404) {
        return {
            valid: false,
            reason: "not_found"
        };
    }

    if (!response.ok) {
        throw new Error(
            `License validation error: ${response.status} ${response.statusText}`
        );
    }

    const document = await response.json();
    const data = parseFirestoreDocument(document);

    if (!data.isActive) {
        return {
            valid: false,
            reason: "inactive"
        };
    }

    if (data.expiresAt) {
        const expiry = data.expiresAt;

        if (Date.now() > expiry.getTime()) {
            return {
                valid: false,
                reason: "expired"
            };
        }
    }

    return {
        valid: true,
        userId: data.userId,
        expiresAt: data.expiresAt.toLocaleDateString("vi-VN") || null
    };
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

