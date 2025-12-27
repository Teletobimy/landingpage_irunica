export async function getLatestTrends(type: 'category' | 'color') {
    const DATA_PROJECT_ID = "oliveyoung-ranking";
    const url = `https://firestore.googleapis.com/v1/projects/${DATA_PROJECT_ID}/databases/(default)/documents:runQuery`;

    const query = {
        structuredQuery: {
            from: [{ collectionId: "trend_analysis" }],
            where: {
                fieldFilter: {
                    field: { fieldPath: "type" },
                    op: "EQUAL",
                    value: { stringValue: `${type}_trends` }
                }
            },
            orderBy: [{ field: { fieldPath: "updatedAt" }, direction: "DESCENDING" }],
            limit: 1
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query),
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            const errorDetail = await response.text();
            console.warn(`[Data Project Error] ${response.status}: ${errorDetail}`);
            return null;
        }

        const result = await response.json();
        if (!result || !result[0]?.document) {
            console.warn(`No ${type} data found in oliveyoung-ranking.`);
            return null;
        }

        // Reuse existing parser
        const doc = result[0].document;
        return {
            id: doc.name.split('/').pop(),
            data: parseFirestoreValue(doc.fields.data),
            updatedAt: doc.fields.updatedAt.stringValue
        };
    } catch (error) {
        console.error(`Latest ${type} Fetch Error:`, error);
        return null;
    }
}

// Helper to parse Firestore REST API response format
export function parseFirestoreValue(value: any): any {
    if (value.mapValue) {
        const map = value.mapValue.fields || {};
        const obj: any = {};
        for (const key in map) {
            obj[key] = parseFirestoreValue(map[key]);
        }
        return obj;
    } else if (value.arrayValue) {
        const arr = value.arrayValue.values || [];
        return arr.map((v: any) => parseFirestoreValue(v));
    } else if (value.stringValue !== undefined) {
        return value.stringValue;
    } else if (value.integerValue !== undefined) {
        return Number(value.integerValue);
    } else if (value.doubleValue !== undefined) {
        return Number(value.doubleValue);
    } else if (value.booleanValue !== undefined) {
        return value.booleanValue;
    } else if (value.timestampValue !== undefined) {
        return value.timestampValue;
    } else if (value.nullValue !== undefined) {
        return null;
    }
    return value;
}
