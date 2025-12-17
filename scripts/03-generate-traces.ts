import { MastraClient } from "@mastra/client-js";
import { readFileSync, writeFileSync } from "fs";
import { z } from "zod";

// Schema for queries from queries.json
const QuerySchema = z.object({
  featureArea: z.string(),
  queryIntent: z.string(),
  queryClarity: z.string(),
  query: z.string(),
  reasoning: z.string(),
  documentationPaths: z.array(z.string()),
});

const QueriesArraySchema = z.array(QuerySchema);

// Load queries from JSON file
function loadQueries() {
  const queriesPath = new URL("./queries.json", import.meta.url);
  const content = readFileSync(queriesPath, "utf-8");
  return QueriesArraySchema.parse(JSON.parse(content));
}

export const mastraClient = new MastraClient({
  baseUrl: "http://localhost:4111/",
});

const main = async () => {
  console.log("Starting trace generation...\n");

  // Load queries
  const queries = loadQueries();
  console.log(`Loaded ${queries.length} queries\n`);

  // Get the docs agent
  const docsAgent = mastraClient.getAgent("docsAgent");

  const results: Array<{
    featureArea: string;
    queryIntent: string;
    queryClarity: string;
    query: string;
    response: string;
  }> = [];

  // Iterate through each query and call the agent
  for (let i = 0; i < queries.length; i++) {
    const queryData = queries[i];
    console.log(
      `[${i + 1}/${queries.length}] Processing: ${queryData.featureArea} - ${queryData.queryIntent}`
    );
    console.log(`  Query: "${queryData.query.slice(0, 80)}..."`);

    try {
      // Call the agent with the query
      const response = await docsAgent.generate({
        messages: [
          {
            role: "user",
            content: queryData.query,
          },
        ],
      });

      const responseText =
        typeof response.text === "string"
          ? response.text
          : JSON.stringify(response.text);

      console.log(`  Response received (${responseText.length} chars)\n`);

      results.push({
        featureArea: queryData.featureArea,
        queryIntent: queryData.queryIntent,
        queryClarity: queryData.queryClarity,
        query: queryData.query,
        response: responseText,
      });
    } catch (error) {
      console.error(`  Error calling agent:`, error);
      results.push({
        featureArea: queryData.featureArea,
        queryIntent: queryData.queryIntent,
        queryClarity: queryData.queryClarity,
        query: queryData.query,
        response: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  // Save results
  const outputPath = new URL("./traces.json", import.meta.url);
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nGenerated ${results.length} traces`);
  console.log(`Saved to ${outputPath.pathname}`);

  return results;
};

// Run the script
await main();
