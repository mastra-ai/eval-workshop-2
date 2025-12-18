import { runEvals } from "@mastra/core/evals";
import { allQueries } from "./queries-example";
import { mastra } from "../src/mastra";
import { mdxPathScorer } from "../src/mastra/scorers/mdx-path-scorer";
import { relevantLinkScorer } from "../src/mastra/scorers/relevant-link-scorer";

const docsAgent = mastra.getAgent('docsAgent');
const data = allQueries.slice(0,4).map((queryItem) => { return { input: queryItem.query, groundTruth: queryItem.query } });

const result = await runEvals({
    data,
    target: docsAgent,
    onItemComplete: ({ scorerResults }) => {
        console.log(`MDX Path Score: ${scorerResults["mdx-path-scorer"].score} - ${scorerResults["mdx-path-scorer"].reason}`);
        console.log(`Relevant Link Score: ${scorerResults["relevant-link-scorer"].score} - ${scorerResults["relevant-link-scorer"].reason}`);
    },
    scorers: [mdxPathScorer, relevantLinkScorer],
});

console.log(JSON.stringify(result, null, 2));