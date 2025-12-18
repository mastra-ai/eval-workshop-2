export const relavantLinkScorerDataset = [
    {
      "featureArea": "Agents",
      "queryIntent": "Implementation",
      "queryClarity": "Clear & specific",
      "query": "How do I create an agent in Mastra that returns structured JSON output using a Zod schema?",
      "response": "You create a normal Mastra agent, then call `.generate` (or `.stream`) with a `structuredOutput` option that includes your Zod schema. Mastra validates the model output against that schema and gives you a typed `response.object`.\n\nHere’s the minimal pattern.\n\n## 1. Install dependencies\n\n```bash\npnpm add mastra zod\n```\n\n## 2. Define your agent\n\n```ts\n// src/agents/testAgent.ts\nimport { Mastra } from \"mastra\";\nimport { Agent } from \"@mastra/agents\"; // if you're organizing via agents package in your project\n\nconst mastra = new Mastra({\n  // configure your default model provider here (e.g. OpenAI, Anthropic, etc.)\n  // model: \"openai/gpt-4o\",\n});\n\nexport const testAgent = new Agent({\n  name: \"structured-output-agent\",\n  instructions: \"You are a helpful assistant.\",\n  model: \"openai/gpt-4o\", // or your default Mastra model router name\n});\n```\n\n(Agent creation can vary slightly depending on how your project is scaffolded, but the key part is just having an `Agent` instance like `testAgent`.)\n\n## 3. Use Zod to define your output schema\n\n```ts\n// src/structured-example.ts\nimport { z } from \"zod\";\nimport { testAgent } from \"./agents/testAgent\";\n\nconst DayPlanSchema = z.array(\n  z.object({\n    name: z.string(),\n    activities: z.array(z.string()),\n  })\n);\n\nasync function run() {\n  const response = await testAgent.generate(\"Help me plan my day.\", {\n    structuredOutput: {\n      schema: DayPlanSchema,\n    },\n  });\n\n  // Typed, validated object that matches DayPlanSchema\n  const plan = response.object;\n  console.log(plan);\n}\n\nrun();\n```\n\nKey points:\n\n- `structuredOutput.schema` is your Zod schema.\n- The **raw model text** is still available at `response.text`, but your **JSON object** is on `response.object`.\n- If the response doesn’t match the schema, Mastra throws by default (you can customize this).\n\nThis is exactly what’s described in **“Structured Output | Agents”** (see docs excerpt used above).\n\n## 4. Using a more complex schema\n\nYou can encode arbitrary shapes with Zod. For example, an analysis object:\n\n```ts\nimport { z } from \"zod\";\nimport { testAgent } from \"./agents/testAgent\";\n\nconst AnalysisSchema = z.object({\n  overview: z.string(),\n  strengths: z.array(z.string()),\n  weaknesses: z.array(z.string()),\n  useCases: z.array(\n    z.object({\n      scenario: z.string(),\n      reasoning: z.string(),\n    })\n  ),\n  comparison: z.object({\n    similarTo: z.array(z.string()),\n    differentiators: z.array(z.string()),\n  }),\n});\n\nasync function analyzeTypeScript() {\n  const response = await testAgent.generate(\"Analyze the TypeScript programming language.\", {\n    structuredOutput: {\n      schema: AnalysisSchema,\n      // Optionally, a different model can be used just for structuring:\n      // model: \"openai/gpt-4o\",\n    },\n  });\n\n  const analysis = response.object; // typed as z.infer<typeof AnalysisSchema>\n  console.log(analysis.comparison.differentiators);\n}\n```\n\n## 5. Error handling strategies\n\nYou can control how strict Mastra is when validation fails via `errorStrategy`:\n\n```ts\nimport { z } from \"zod\";\nimport { testAgent } from \"./agents/testAgent\";\n\nconst SummarySchema = z.object({\n  summary: z.string(),\n  keyFeatures: z.array(z.string()),\n});\n\nasync function safeSummary() {\n  const response = await testAgent.generate(\"Tell me about TypeScript.\", {\n    structuredOutput: {\n      schema: SummarySchema,\n      errorStrategy: \"fallback\", // \"strict\" | \"warn\" | \"fallback\"\n      fallbackValue: {\n        summary: \"TypeScript is a typed superset of JavaScript\",\n        keyFeatures: [\"Static typing\", \"Compiles to JavaScript\", \"Better tooling\"],\n      },\n    },\n  });\n\n  console.log(response.object);\n}\n```\n\n## 6. Streaming with structured output (optional)\n\nYou can also stream, and still get a final validated object:\n\n```ts\nimport { z } from \"zod\";\nimport { testAgent } from \"./agents/testAgent\";\n\nconst DayPlanSchema = z.array(\n  z.object({\n    name: z.string(),\n    activities: z.array(z.string()),\n  })\n);\n\nasync function streamPlan() {\n  const stream = await testAgent.stream(\"Help me plan my day.\", {\n    structuredOutput: {\n      schema: DayPlanSchema,\n    },\n  });\n\n  // final validated object\n  const plan = await stream.object;\n  console.log(\"Final object:\", plan);\n\n  // if you want to inspect the full stream:\n  for await (const chunk of stream.fullStream) {\n    if (chunk.type === \"object-result\") {\n      console.log(\"Object result chunk:\", JSON.stringify(chunk, null, 2));\n    }\n  }\n}\n```\n\n## 7. When your model doesn’t support `response_format`\n\nIf your provider doesn’t support native JSON/response_format, or you’re on Gemini 2.5 with tools, you can force prompt-based JSON output:\n\n```ts\nimport { z } from \"zod\";\nimport { testAgent } from \"./agents/testAgent\";\n\nconst DayPlanSchema = z.array(\n  z.object({\n    name: z.string(),\n    activities: z.array(z.string()),\n  })\n);\n\nasync function run() {\n  const response = await testAgent.generate(\"Help me plan my day.\", {\n    structuredOutput: {\n      schema: DayPlanSchema,\n      jsonPromptInjection: true, // instructs via prompt instead of response_format\n    },\n  });\n\n  console.log(response.object);\n}\n```\n\n---\n\nIf you share which model/provider and runtime you’re using (Next.js, Node script, edge, etc.), I can tailor a ready-to-paste file structure for you.\n\n---\n\n## Helpful Links\n\n**Documentation**\n- Structured Output for Agents (explains `structuredOutput`, Zod/JSON Schema, streaming, error handling):  \n  (path: `agents/structured-output.mdx`)  \n- Agent `.generate` API with structured output options (see “structuredOutput” section):  \n  (path: `reference/agents/generate.mdx`)\n\n**Examples**\n- Quick Start example repo (shows basic agent setup you can extend with `structuredOutput`):  \n  https://github.com/mastra-ai/mastra/tree/main/examples/quick-start\n\n**Blog Posts**\n- “Introducing Output Processors” – background on how Mastra thinks about structured/processed outputs and validation:  \n  https://mastra.ai/blog/announcing-output-processors",
      "toolCalls": [
        {
          "toolName": "mastraDocsTool",
          "toolCallArgs": {
            "paths": [
              "agents/index.mdx",
              "reference/agents/index.mdx",
              "reference/ai-sdk/index.mdx",
              "reference/core/index.mdx"
            ],
            "queryKeywords": [
              "agent",
              "structured output",
              "zod",
              "schema",
              "json"
            ]
          }
        },
        {
          "toolName": "mastraExamplesTool",
          "toolCallArgs": {
            "queryKeywords": [
              "agent",
              "structured",
              "zod",
              "schema",
              "json"
            ]
          }
        },
        {
          "toolName": "mastraBlogTool",
          "toolCallArgs": {
            "url": "/api/blog"
          }
        },
        {
          "toolName": "mastraDocsTool",
          "toolCallArgs": {
            "paths": [
              "agents/structured-output.mdx"
            ],
            "queryKeywords": [
              "zod",
              "structured output",
              "schema"
            ]
          }
        },
        {
          "toolName": "linkCheckerTool",
          "toolCallArgs": {
            "urls": [
              "https://mastra.ai/docs/agents/structured-output",
              "https://mastra.ai/docs/reference/v1/agents/generate",
              "https://github.com/mastra-ai/mastra/tree/main/examples/quick-start",
              "https://mastra.ai/blog/announcing-output-processors"
            ]
          }
        }
      ]
    }
  ]