import { Agent } from "@mastra/core/agent";
import { writeFileSync } from "fs";
import { z } from "zod";

// Define the dimensions and their values based on the workshop document
const dimensions = {
  featureArea: [
    "Agents",
    "Workflows",
    "RAG",
    "Memory",
    "Tools & MCP",
    "Voice",
    "Deployment",
    "Observability",
    "Evals",
    "Models & Providers",
    "Server & Client",
    "Getting Started",
  ],
  queryIntent: [
    "Conceptual", // "What is X?", "How does X work?"
    "Implementation", // "How do I build/set up X?"
    "Configuration", // "How do I configure X?", "What options exist?"
    "Comparison", // "Difference between X and Y?", "Which should I use?"
  ],
  queryClarity: [
    "Clear & specific", // Well-defined question with enough context
    "Vague/ambiguous", // Unclear what they're actually asking
    "Wrong terminology", // Uses close-but-incorrect terms
  ],
};

// Schema for the generated tuples
export const TupleSchema = z.object({
  featureArea: z.string(),
  queryIntent: z.string(),
  queryClarity: z.string(),
});

const TuplesArraySchema = z.array(TupleSchema);

const tupleGeneratorAgent = new Agent({
  id: "tuple-generator-agent",
  name: "Tuple Generator Agent",
  instructions: `You are a helpful assistant that generates random tuples using the dimensions provided.

When asked to generate tuples, you should:
1. Create diverse combinations across all dimension values
2. Ensure good coverage of different feature areas, query intents, and clarity levels
3. Return the tuples as a valid JSON array

The dimensions are:
- featureArea: ${dimensions.featureArea.join(", ")}
- queryIntent: ${dimensions.queryIntent.join(", ")}
- queryClarity: ${dimensions.queryClarity.join(", ")}

Example output:
[
  { "featureArea": "Agents", "queryIntent": "Comparison", "queryClarity": "Vague/ambiguous" },
  { "featureArea": "Workflows", "queryIntent": "Implementation", "queryClarity": "Clear & specific" },
  { "featureArea": "RAG", "queryIntent": "Conceptual", "queryClarity": "Wrong terminology" }
]

Generate diverse tuples that represent realistic user query scenarios for a Mastra documentation chatbot.`,
  model: "openai/gpt-4o-mini",
});

async function generateTuples(count: number = 20) {
  console.log(`Generating ${count} tuples...`);

  const response = await tupleGeneratorAgent.generate(
    `Generate ${count} random tuples.`,
    {
      structuredOutput: {
        schema: TuplesArraySchema,
      },
    }
  );

  // Get tuples directly from structured output
  const tuples = response.object;

  if (!tuples) {
    throw new Error("Failed to generate tuples");
  }

  console.log(`Generated ${tuples.length} tuples`);

  // Save to JSON file
  const outputPath = new URL("./tuples.json", import.meta.url);
  writeFileSync(outputPath, JSON.stringify(tuples, null, 2));
  console.log(`Tuples saved to ${outputPath.pathname}`);

  return tuples;
}

// Run the script
const tuples = await generateTuples(20);
console.log("\nGenerated tuples:");
console.log(tuples);
