export const agentQueries = [
  {
    id: 1,
    featureArea: "Agents",
    queryIntent: "Implementation",
    queryClarity: "Clear & specific",
    query:
      "How do I create an agent in Mastra that returns structured JSON output using a Zod schema?",
  },
  {
    id: 3,
    featureArea: "Agents",
    queryIntent: "Conceptual",
    queryClarity: "Clear & specific",
    query:
      "What's the difference between agent.generate() and agent.stream()? When should I use each one?",
  },
  {
    id: 4,
    featureArea: "Agents",
    queryIntent: "Configuration",
    queryClarity: "Vague/ambiguous",
    query: "How do I set up the options for my agent?",
  },
  {
    id: 5,
    featureArea: "Agents",
    queryIntent: "Comparison",
    queryClarity: "Clear & specific",
    query:
      "What's the difference between using maxSteps and onStepFinish when generating agent responses?",
  },
  {
    id: 6,
    featureArea: "Agents",
    queryIntent: "Implementation",
    queryClarity: "Wrong terminology",
    query:
      "How do I create a bot with a system prompt that can call external APIs?",
  },
  {
    id: 8,
    featureArea: "Agents",
    queryIntent: "Conceptual",
    queryClarity: "Wrong terminology",
    query: "What's the difference between a bot and a pipeline in Mastra?",
  },
  {
    id: 9,
    featureArea: "Agents",
    queryIntent: "Configuration",
    queryClarity: "Clear & specific",
    query:
      "How do I configure an agent to use Claude and enable prompt caching?",
  },
  {
    id: 11,
    featureArea: "Agents",
    queryIntent: "Debugging",
    queryClarity: "Clear & specific",
    query:
      "Why does my agent stop after one tool call even though I set maxSteps to 10?",
  },
  {
    id: 12,
    featureArea: "Agents",
    queryIntent: "Comparison",
    queryClarity: "Vague/ambiguous",
    query: "Should I use agents or workflows for my chatbot? Which is better?",
  },
  {
    id: 15,
    featureArea: "Agents",
    queryIntent: "Implementation",
    queryClarity: "Vague/ambiguous",
    query: "How do I make an agent that remembers stuff?",
  },
  {
    id: 16,
    featureArea: "Agents",
    queryIntent: "Debugging",
    queryClarity: "Wrong terminology",
    query:
      "My bot's prompt isn't being used. It ignores the personality I set.",
  },
  {
    id: 17,
    featureArea: "Agents",
    queryIntent: "Comparison",
    queryClarity: "Wrong terminology",
    query: "Should I use a bot or a chain for handling multi-step tasks?",
  },
  {
    id: 18,
    featureArea: "Agents",
    queryIntent: "Configuration",
    queryClarity: "Wrong terminology",
    query: "How do I set the persona and temperature for my chatbot?",
  },
];

export const workflowQueries = [
  {
    id: 1,
    featureArea: "Workflows",
    queryIntent: "Implementation",
    queryClarity: "Clear & specific",
    query:
      "How do I create a workflow that branches based on a condition and runs different steps depending on the result?",
  },
  {
    id: 3,
    featureArea: "Workflows",
    queryIntent: "Conceptual",
    queryClarity: "Clear & specific",
    query:
      "What's the difference between `suspend()` and `.sleep()` in Mastra workflows? When should I use each one?",
  },
  {
    id: 5,
    featureArea: "Workflows",
    queryIntent: "Comparison",
    queryClarity: "Clear & specific",
    query:
      "When should I use `.parallel()` vs chaining multiple `.then()` calls? What are the tradeoffs?",
  },
  {
    id: 6,
    featureArea: "Workflows",
    queryIntent: "Implementation",
    queryClarity: "Wrong terminology",
    query:
      "How do I create a pipeline with multiple stages that pass data to each other?",
  },
  {
    id: 7,
    featureArea: "Workflows",
    queryIntent: "Debugging",
    queryClarity: "Vague/ambiguous",
    query:
      "My workflow just stops in the middle and never finishes. What's going on?",
  },
  {
    id: 8,
    featureArea: "Workflows",
    queryIntent: "Conceptual",
    queryClarity: "Wrong terminology",
    query:
      "What is a checkpoint in Mastra workflows? How do I save my workflow's progress?",
  },
  {
    id: 9,
    featureArea: "Workflows",
    queryIntent: "Configuration",
    queryClarity: "Clear & specific",
    query:
      "How do I configure retry attempts for a specific step that calls an unreliable external API?",
  },
  {
    id: 11,
    featureArea: "Workflows",
    queryIntent: "Debugging",
    queryClarity: "Clear & specific",
    query:
      "Why does my workflow stay in `suspended` status after I call `run.resume()`? The step has a valid `resumeSchema` and I'm passing the correct data.",
  },
  {
    id: 15,
    featureArea: "Workflows",
    queryIntent: "Implementation",
    queryClarity: "Vague/ambiguous",
    query:
      "How do I make a workflow that waits for something before continuing?",
  },
  {
    id: 16,
    featureArea: "Workflows",
    queryIntent: "Debugging",
    queryClarity: "Wrong terminology",
    query:
      "My pipeline keeps restarting from the beginning instead of continuing where it left off.",
  },
  {
    id: 17,
    featureArea: "Workflows",
    queryIntent: "Comparison",
    queryClarity: "Includes code/error",
    query:
      "What's the difference between `.dountil()` and `.dowhile()`?",
  },
];

export const memoryQueries = [
  {
    id: 1,
    featureArea: "Memory",
    queryIntent: "Implementation",
    queryClarity: "Clear & specific",
    query:
      "How do I set up an agent with semantic recall that retrieves the 5 most relevant messages from past conversations?",
  },
  {
    id: 3,
    featureArea: "Memory",
    queryIntent: "Conceptual",
    queryClarity: "Clear & specific",
    query:
      "What's the difference between working memory, conversation history, and semantic recall in Mastra? When should I use each one?",
  },
  {
    id: 4,
    featureArea: "Memory",
    queryIntent: "Configuration",
    queryClarity: "Vague/ambiguous",
    query: "How do I configure memory options for my agent?",
  },
  {
    id: 5,
    featureArea: "Memory",
    queryIntent: "Comparison",
    queryClarity: "Clear & specific",
    query:
      "What's the difference between thread-scoped and resource-scoped working memory? Which one persists across conversations?",
  },
  {
    id: 6,
    featureArea: "Memory",
    queryIntent: "Implementation",
    queryClarity: "Wrong terminology",
    query:
      "How do I add long-term memory to my chatbot so it can remember things about users between sessions?",
  },
  {
    id: 7,
    featureArea: "Memory",
    queryIntent: "Debugging",
    queryClarity: "Vague/ambiguous",
    query:
      "My agent doesn't remember anything from previous messages. Memory isn't working.",
  },
  {
    id: 8,
    featureArea: "Memory",
    queryIntent: "Conceptual",
    queryClarity: "Wrong terminology",
    query:
      "What is the context window in Mastra memory? How does the recall buffer work?",
  },
  {
    id: 9,
    featureArea: "Memory",
    queryIntent: "Configuration",
    queryClarity: "Clear & specific",
    query:
      "How do I configure working memory with a Zod schema instead of a Markdown template?",
  },
  {
    id: 10,
    featureArea: "Memory",
    queryIntent: "Implementation",
    queryClarity: "Includes code/error",
    query:
      "I'm trying to use PostgreSQL for memory storage but getting `relation 'mastra_threads' does not exist`:\n```ts\nconst memory = new Memory({\n  storage: new PostgresStore({\n    connectionString: process.env.DATABASE_URL\n  })\n});\n```",
  },
  {
    id: 11,
    featureArea: "Memory",
    queryIntent: "Debugging",
    queryClarity: "Clear & specific",
    query:
      "Why does semantic recall return empty results even though I have messages stored? I've verified the vector store has embeddings.",
  },
  {
    id: 12,
    featureArea: "Memory",
    queryIntent: "Comparison",
    queryClarity: "Vague/ambiguous",
    query:
      "Should I use the built-in memory or set up my own database for storing conversations?",
  },
  {
    id: 15,
    featureArea: "Memory",
    queryIntent: "Implementation",
    queryClarity: "Vague/ambiguous",
    query: "How do I make my agent remember user preferences?",
  },
  {
    id: 16,
    featureArea: "Memory",
    queryIntent: "Debugging",
    queryClarity: "Wrong terminology",
    query:
      "My bot's cache isn't saving the chat history. The conversation resets every time.",
  },
];

export const ragQueries = [
  {
    id: 1,
    featureArea: "RAG",
    queryIntent: "Implementation",
    queryClarity: "Clear & specific",
    query:
      "How do I set up a RAG pipeline with pgvector that chunks markdown documents and retrieves the top 5 most relevant results?",
  },
  {
    id: 4,
    featureArea: "RAG",
    queryIntent: "Configuration",
    queryClarity: "Clear & specific",
    query:
      "How do I configure metadata filtering to only retrieve chunks from a specific document source and date range?",
  },
  {
    id: 5,
    featureArea: "RAG",
    queryIntent: "Comparison",
    queryClarity: "Wrong terminology",
    query:
      "What's the difference between the search index and the embedding store? Should I use Pinecone or just a regular database?",
  },
  {
    id: 6,
    featureArea: "RAG",
    queryIntent: "Implementation",
    queryClarity: "Vague/ambiguous",
    query: "How do I add document search to my agent?",
  },
];

export const mcpAndToolsQueries = [
  {
    id: 1,
    featureArea: "Tools & MCP",
    queryIntent: "Implementation",
    queryClarity: "Clear & specific",
    query:
      "How do I set up an MCPClient that connects to both a local Wikipedia MCP server via npx and a remote weather API via URL, then use those tools in my agent?",
  },
  {
    id: 2,
    featureArea: "Tools & MCP",
    queryIntent: "Debugging",
    queryClarity: "Vague/ambiguous",
    query: "My agent isn't using the tool I added to it",
  },
  {
    id: 3,
    featureArea: "Tools & MCP",
    queryIntent: "Conceptual",
    queryClarity: "Clear & specific",
    query:
      "What's the difference between static tools with listTools() and dynamic tools with listToolsets()? When should I use each approach?",
  },
  {
    id: 4,
    featureArea: "Tools & MCP",
    queryIntent: "Configuration",
    queryClarity: "Vague/ambiguous",
    query: "How do I set up MCP in my project?",
  },
  {
    id: 5,
    featureArea: "Tools & MCP",
    queryIntent: "Comparison",
    queryClarity: "Clear & specific",
    query:
      "What's the difference between MCPClient and MCPServer? When would I use one vs the other?",
  },
  {
    id: 6,
    featureArea: "Tools & MCP",
    queryIntent: "Debugging",
    queryClarity: "Wrong terminology",
    query:
      "The plugin connector can't find the external functions from the protocol server. It says 'server not found' when I try to load the toolkit.",
  },
];

export const voiceQueries = [
  {
    id: 1,
    featureArea: "Voice",
    queryIntent: "Implementation",
    queryClarity: "Clear & specific",
    query:
      "How do I create a voice agent that uses OpenAI for speech-to-text and ElevenLabs for text-to-speech?",
  },
  {
    id: 2,
    featureArea: "Voice",
    queryIntent: "Debugging",
    queryClarity: "Wrong terminology",
    query:
      "The audio converter isn't generating any sound output. I'm calling the synthesizer method but the stream comes back empty.",
  },
  {
    id: 4,
    featureArea: "Voice",
    queryIntent: "Configuration",
    queryClarity: "Clear & specific",
    query:
      "How do I configure OpenAIRealtimeVoice to use the 'shimmer' speaker and connect to the gpt-4o-realtime model for speech-to-speech interactions?",
  },
  {
    id: 5,
    featureArea: "Voice",
    queryIntent: "Comparison",
    queryClarity: "Wrong terminology",
    query:
      "What's the difference between the audio streamer and the batch transcriber? Should I use the live mode or the regular synthesizer?",
  },
];

export const deploymentQueries = [
  {
    id: 1,
    featureArea: "Deployment",
    queryIntent: "Implementation",
    queryClarity: "Clear & specific",
    query:
      "How do I deploy my Mastra app to AWS Lambda with Docker and connect it to a Turso database for persistent memory?",
  },
  {
    id: 2,
    featureArea: "Deployment",
    queryIntent: "Debugging",
    queryClarity: "Vague/ambiguous",
    query: "My deployment keeps failing",
  },
  {
    id: 4,
    featureArea: "Deployment",
    queryIntent: "Comparison",
    queryClarity: "Clear & specific",
    query:
      "What's the difference between deploying to Mastra Cloud vs using the VercelDeployer? Which one should I use for a production app?",
  },
];

export const observabilityQueries = [
  {
    id: 1,
    featureArea: "Observability",
    queryIntent: "Implementation",
    queryClarity: "Clear & specific",
    query:
      "How do I set up the OtelBridge so my Mastra agent calls appear as child spans under my existing Hono HTTP request traces?",
  },
  {
    id: 2,
    featureArea: "Observability",
    queryIntent: "Configuration",
    queryClarity: "Clear & specific",
    query:
      "How do I configure Mastra observability to send traces to both Langfuse and my OpenTelemetry backend at the same time?",
  },
  {
    id: 3,
    featureArea: "Observability",
    queryIntent: "Debugging",
    queryClarity: "Vague/ambiguous",
    query: "My traces aren't showing up",
  },
  {
    id: 4,
    featureArea: "Observability",
    queryIntent: "Conceptual",
    queryClarity: "Clear & specific",
    query:
      "How does the OtelBridge differ from the OpenTelemetry Exporter? When should I use each one?",
  },
];

export const evalsQueries = [
  {
    id: 1,
    featureArea: "Evals",
    queryIntent: "Implementation",
    queryClarity: "Clear & specific",
    query:
      "How do I create a custom scorer using createScorer that has a preprocess step to extract keywords, an analyze step using an LLM judge, and returns a score between 0 and 1?",
  },
  {
    id: 2,
    featureArea: "Evals",
    queryIntent: "Debugging",
    queryClarity: "Clear & specific",
    query:
      "My scorer's generateReason step is returning undefined even though analyzeStepResult has valid data:\n```ts\n.generateReason(({ results }) => {\n  return `Score based on: ${results.analyzeStepResult.findings}`;\n})\n```\nThe analyze step returns { findings: ['item1', 'item2'] } correctly.",
  },
  {
    id: 3,
    featureArea: "Evals",
    queryIntent: "Configuration",
    queryClarity: "Vague/ambiguous",
    query: "How do I add evals to my agent?",
  },
  {
    id: 4,
    featureArea: "Evals",
    queryIntent: "Conceptual",
    queryClarity: "Clear & specific",
    query:
      "What's the difference between using functions vs prompt objects in the createScorer pipeline? When should I use each approach?",
  },
  {
    id: 5,
    featureArea: "Evals",
    queryIntent: "Comparison",
    queryClarity: "Wrong terminology",
    query:
      "What's the difference between a metric evaluator and a validation checker? Should I use the grader or the response validator for testing my agent's accuracy?",
  },
];

export const serverAndClientQueries = [
  {
    id: 1,
    featureArea: "Server & Client",
    queryIntent: "Implementation",
    queryClarity: "Clear & specific",
    query:
      "How do I create a custom API route with registerApiRoute that has authentication middleware and accesses the Mastra instance to call an agent?",
  },
  {
    id: 2,
    featureArea: "Server & Client",
    queryIntent: "Debugging",
    queryClarity: "Includes code/error",
    query:
      "Getting CORS errors when calling my Mastra server from my React app:\n```ts\nconst mastraClient = new MastraClient({\n  baseUrl: 'http://localhost:4111'\n});\n\nconst agent = mastraClient.getAgent('testAgent');\nawait agent.generate({ messages: [{ role: 'user', content: 'Hello' }] });\n```\nError: `Access to fetch at 'http://localhost:4111' from origin 'http://localhost:3000' has been blocked by CORS policy`",
  },
  {
    id: 3,
    featureArea: "Server & Client",
    queryIntent: "Configuration",
    queryClarity: "Vague/ambiguous",
    query: "How do I set up storage for my Mastra app?",
  },
  {
    id: 4,
    featureArea: "Server & Client",
    queryIntent: "Conceptual",
    queryClarity: "Clear & specific",
    query:
      "How does RequestContext flow from server middleware through to agent tools? Can I set values in middleware and access them inside a tool's execute function?",
  },
  {
    id: 5,
    featureArea: "Server & Client",
    queryIntent: "Comparison",
    queryClarity: "Wrong terminology",
    query:
      "What's the difference between the request interceptor and the route handler? Should I use the API adapter or the endpoint wrapper to add authentication?",
  },
];

export const allQueries = [
  ...agentQueries,
  ...workflowQueries,
  ...memoryQueries,
  ...ragQueries,
  ...mcpAndToolsQueries,
  ...voiceQueries,
  ...deploymentQueries,
  ...observabilityQueries,
  ...evalsQueries,
  ...serverAndClientQueries,
];
