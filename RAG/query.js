
import 'dotenv/config'

import readlineSync, { question } from 'readline-sync';

import {GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI} from '@langchain/google-genai';

import { Pinecone } from '@pinecone-database/pinecone';

import {PromptTemplate} from '@langchain/core/prompts';

import { StringOutputParser } from '@langchain/core/output_parsers';

import { RunnableSequence } from '@langchain/core/runnables';



// Config embedding model

const embedding = new GoogleGenerativeAIEmbeddings({
    apiKey : process.env.GEMINI_API_KEY,
    model : 'gemini-embedding-2-preview',
    outputDimensionality : 768
});

// Config model

const model = new ChatGoogleGenerativeAI({
    apiKey : process.env.GEMINI_API_KEY,
    model : 'gemini-3.5-flash-lite',
    temperature : 0.3
})


// Config DB

const pinecone = new Pinecone();

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);


// Creating Prompt template

const promptTemplate = PromptTemplate.fromTemplate(`
    
    You are a helpful assistant answering questions based on the provided documentation.
    
    Context from the documentation:
    {context}

    Question : {question}

    Instructions:
    - Answer the question using ONLY the information from the context above
    - If the answer is not in the context, say "I don't have enough information to answer this question"
    - Be concise and clear
    - Use code examples from the context if relevant

    Answer : 
`)


async function chatting(question)
{
    // Find vector embedding of the question

    const queryVector = await embedding.embedQuery(question);

    // Using embedding search vector DB for top 10 results 

    const searchResults = await pineconeIndex.query({
        topK : 10,
        vector : queryVector,
        includeMetadata : true
    });

    // Filter out the data 

    const context = searchResults.matches
                    .map(match => match.metadata.text)
                    .join("\n\n---\n\n");


    // Give question + top 10 results to LLM

    const chain = RunnableSequence.from([
        promptTemplate,
        model,
        new StringOutputParser()
    ]);

    const answer = await chain.invoke({
        context : context,
        question : question
    });

    console.log(answer);
}

async function main()
{
    const userProblem = readlineSync.question("Ask me anything : ");

    await chatting(userProblem);

    main();
}

main();
