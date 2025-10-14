import { llm } from "../config/llm.config";
import { index } from "../config/pinecone.config";

class Embeddings {
  async generate(text: string) {
    const response = await llm.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: {
        outputDimensionality: 1024,
      },
    });

    return response;
  }
  async upload(vectorId: string, patient: string, embeddings: number[]) {
    return await index.upsert([
      {
        id: vectorId,
        values: embeddings,
        metadata: {
          patient: patient,
        },
      },
    ]);
  }
}

export default new Embeddings();
