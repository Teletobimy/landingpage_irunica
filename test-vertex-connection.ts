
import { VertexAI } from '@google-cloud/vertexai';

async function testConnection() {
    console.log('--- Vertex AI Connection Test ---');
    const projectId = 'gen-lang-client-0578854454';
    const location = 'us-central1';

    console.log(`Project: ${projectId}`);
    console.log(`Location: ${location}`);

    try {
        const vertexAI = new VertexAI({ project: projectId, location });
        const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

        console.log('Attempting to generate simple content...');
        const result = await model.generateContent('Say "Hello World" if you can hear me.');
        const response = await result.response;
        console.log('SUCCESS:', response.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
        console.error('FAILED:');
        console.error(error);
    }
}

testConnection();
