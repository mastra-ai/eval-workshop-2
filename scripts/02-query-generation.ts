import { Agent } from "@mastra/core/agent";
import { readFileSync, writeFileSync } from "fs";
import { z } from "zod";
import { docsMcp } from "../src/mastra/tools/docs";
import { TupleSchema } from "./01-tuple-generation";

// Schema for the generated query
const GeneratedQuerySchema = z.object({
  query: z.string().describe("The generated user query"),
  reasoning: z
    .string()
    .describe("Brief explanation of how the query matches the tuple"),
});

// Schema for path selection
const PathSelectionSchema = z.object({
  paths: z
    .array(z.string())
    .describe("Selected documentation paths relevant to the feature area"),
});

// Load tuples from JSON file
function loadTuples() {
  const tuplesPath = new URL("./tuples.json", import.meta.url);
  const content = readFileSync(tuplesPath, "utf-8");
  return z.array(TupleSchema).parse(JSON.parse(content));
}

// Get the docs tool from MCP
async function getDocsTool() {
  const tools = await docsMcp.listToolsets();
  return tools.mastraDocs.mastraDocs;
}

// Agent for selecting relevant documentation paths
const pathSelectorAgent = new Agent({
  id: "path-selector-agent",
  name: "Path Selector Agent",
  instructions: `You are a helpful assistant that selects relevant documentation paths based on a feature area.

Given a feature area and a list of available documentation paths, select 1-3 paths that would be most relevant for answering questions about that feature.

Consider both guide paths and reference paths when available.
For example, for "Agents" you might select ["agents/", "reference/agents/"].

Be selective - only choose paths that are directly relevant to the feature area.`,
  model: "openai/gpt-4o-mini",
});

// Agent for generating user queries
const queryGeneratorAgent = new Agent({
  id: "query-generator-agent",
  name: "Query Generator Agent",
  instructions: `You are a helpful assistant that generates realistic user queries for a documentation chatbot.

Given:
1. A tuple with featureArea, queryIntent, and queryClarity
2. Documentation context about the feature

Generate a realistic user query that matches the tuple dimensions:

**Query Intent guidelines:**
- Conceptual: "What is X?", "How does X work?", "Can you explain X?"
- Implementation: "How do I build X?", "How do I set up X?", "Show me how to create X"
- Configuration: "How do I configure X?", "What options exist for X?", "How do I customize X?"
- Comparison: "What's the difference between X and Y?", "Which should I use, X or Y?"

**Query Clarity guidelines:**
- Clear & specific: Well-defined question with enough context, uses correct terminology
- Vague/ambiguous: Unclear what they're actually asking, missing context, broad question
- Wrong terminology: Uses close-but-incorrect terms, confuses similar concepts

Use the documentation context to make the query realistic and grounded in actual Mastra features.
The query should sound like a real user asking a question, not a test case.`,
  model: "openai/gpt-5.2",
});

async function discoverAvailablePaths(docsTool: any): Promise<string> {
  console.log("Discovering available documentation paths...");

  // Call the docs tool with root path to get available structure
  const result = await docsTool.execute({
    paths: [""],
    queryKeywords: [],
  });

  return result;
}

async function selectRelevantPaths(
  featureArea: string,
  availablePaths: string
): Promise<string[]> {
  const response = await pathSelectorAgent.generate(
    `Feature area: ${featureArea}

Available documentation paths:
${availablePaths}

Select the most relevant paths for this feature area.`,
    {
      structuredOutput: {
        schema: PathSelectionSchema,
      },
    }
  );

  return response.object?.paths ?? [];
}

async function fetchDocumentation(
  docsTool: any,
  paths: string[],
  featureArea: string
): Promise<string> {
  const result = await docsTool.execute({
    paths,
    queryKeywords: [featureArea],
  });

  return result;
}

async function generateQuery(
  tuple: z.infer<typeof TupleSchema>,
  documentation: string
): Promise<{ query: string; reasoning: string }> {
  const response = await queryGeneratorAgent.generate(
    `Generate a user query based on this tuple:
- Feature Area: ${tuple.featureArea}
- Query Intent: ${tuple.queryIntent}
- Query Clarity: ${tuple.queryClarity}

Documentation context:
${documentation}

Generate a realistic user query that matches these dimensions.`,
    {
      structuredOutput: {
        schema: GeneratedQuerySchema,
      },
    }
  );

  return (
    response.object
  );
}

async function main() {
  console.log("Starting query generation...\n");

  // Load tuples
  const tuples = loadTuples();
  console.log(`Loaded ${tuples.length} tuples\n`);

  // Get docs tool
  const docsTool = await getDocsTool();

  // Discover available paths
  const availablePaths = await discoverAvailablePaths(docsTool);
  console.log("Available paths discovered\n");

  const results: Array<{
    featureArea: string;
    queryIntent: string;
    queryClarity: string;
    query: string;
    reasoning: string;
    documentationPaths: string[];
  }> = [];

  // Process each tuple
  for (const tuple of tuples) {
    console.log(`Processing: ${tuple.featureArea} - ${tuple.queryIntent} - ${tuple.queryClarity}`);
    try {
      // Select relevant paths
      const selectedPaths = await selectRelevantPaths(
        tuple.featureArea,
        availablePaths
      );
      console.log(`  Selected paths: ${selectedPaths.join(", ")}`);

      // Fetch documentation
      const documentation = await fetchDocumentation(
        docsTool,
        selectedPaths,
        tuple.featureArea
      );

      // Generate query
      const { query, reasoning } = await generateQuery(tuple, documentation);
      console.log(`  Generated query: "${query}"`);

      results.push({
        ...tuple,
        query,
        reasoning,
        documentationPaths: selectedPaths,
      });
    } catch (error) {
      console.error(`  Error processing tuple:`, error);
      results.push({
        ...tuple,
        query: `How do I use ${tuple.featureArea} in Mastra?`,
        reasoning: "Fallback due to error",
        documentationPaths: [],
      });
    }
  }

  // Save results
  const outputPath = new URL("./queries.json", import.meta.url);
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nGenerated ${results.length} queries`);
  console.log(`Saved to ${outputPath.pathname}`);

  // Disconnect MCP client
  await docsMcp.disconnect();

  return results;
}

// Run the script
const queries = await main();
console.log("\nSample generated queries:");
queries.slice(0, 3).forEach((q, i) => {
  console.log(`\n${i + 1}. [${q.featureArea}/${q.queryIntent}/${q.queryClarity}]`);
  console.log(`   Query: "${q.query}"`);
});

