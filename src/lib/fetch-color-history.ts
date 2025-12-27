'use server';

import { parseFirestoreValue } from "./fetch-latest"; // We'll need to export this or copy it if not exported

export async function getColorHistory(colorName: string) {
    const PROJECT_ID = "oliveyoung-ranking";
    const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`;

    // Query to get last 10 'color_trends' documents ordered by date ascending
    const query = {
        structuredQuery: {
            from: [{ collectionId: "trend_analysis" }],
            where: {
                fieldFilter: {
                    field: { fieldPath: "type" },
                    op: "EQUAL",
                    value: { stringValue: "color_trends" }
                }
            },
            orderBy: [{ field: { fieldPath: "date" }, direction: "ASCENDING" }],
            limit: 10
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(query),
        });

        if (!response.ok) {
            console.error("Firestore history fetch failed", response.statusText);
            return [];
        }

        const result = await response.json();
        if (!result || !Array.isArray(result)) return [];

        // Parse and Map results
        return result.map((item: any) => {
            if (!item.document) return null;

            const fields = item.document.fields;
            const date = fields.date?.stringValue;

            // The structure inside 'data' field is complex map: data -> category -> ...
            // We need to parse it carefully or use the helper
            // Let's assume the helper structure: fields.data.mapValue.fields...
            // But since we are inside a specific logic, let's look for the specific path provided in user req.
            // User path: doc.data.mapValue.fields.립메이크업.mapValue.fields

            const dataMap = fields.data?.mapValue?.fields;
            const lipData = dataMap?.['립메이크업']?.mapValue?.fields;

            if (!lipData) return null;

            const colorCodes = lipData.color_codes?.mapValue?.fields;
            const hex = colorCodes?.[colorName]?.stringValue || null;

            const trendingArray = lipData.trending_colors?.arrayValue?.values || [];
            const isTrending = trendingArray.some((v: any) => v.stringValue === colorName);

            if (!hex) return null;

            return { date, hex, isTrending };
        }).filter((point: any) => point !== null);

    } catch (error) {
        console.error("Error fetching color history:", error);
        return [];
    }
}
