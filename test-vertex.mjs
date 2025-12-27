
import { VertexAI } from '@google-cloud/vertexai';

async function testConnection() {
    console.log('--- Vertex AI Connection Test ---');
    const projectId = 'gen-lang-client-0578854454';
    const location = 'us-central1';

    console.log(`Project: ${projectId}`);
    console.log(`Location: ${location}`);

    const vertexAI = new VertexAI({ project: projectId, location });

    const modelsToTry = [
        'gemini-1.5-flash-001',
        'gemini-1.0-pro-001',
        'gemini-pro',
        'text-bison@001'
    ];

    for (const modelName of modelsToTry) {
        console.log(`\nAttempting with "${modelName}"...`);
        try {
            const model = vertexAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say "Hello"');
            const response = await result.response;
            console.log(`SUCCESS (${modelName}):`, response.candidates?.[0]?.content?.parts?.[0]?.text);
            return; // Exit on first success
        } catch (error) {
            console.error(`FAILED (${modelName}):`);
            console.error(error.message);
        }
    }
}

testConnection();
