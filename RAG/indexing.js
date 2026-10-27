
import 'dotenv/config';

import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf';

import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters';

import {GoogleGenerativeAIEmbeddings} from '@langchain/google-genai';

import { Pinecone } from '@pinecone-database/pinecone';

import {PineconeStore} from '@langchain/pinecone';


const CHUNK_SIZE = 1000;

const CHUNK_OVERLAP = 200;


// Loading File

async function indexing()
{
    // Load pdf file

    const PDF_PATH = './Node.pdf';

    const pdfLoader = new PDFLoader(PDF_PATH);

    const rawDocs = await pdfLoader.load();


    // Chunking of the PDF file

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize : CHUNK_SIZE,
        chunkOverlap : CHUNK_OVERLAP,
    });

    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);


    // Embeddings of these chunks

    // Embedding model configured
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey : process.env.GEMINI_API_KEY,
        model : "gemini-embedding-2-preview",
        outputDimensionality : 768
    });

    
    // Configured Pinecone
    const pinecone = new Pinecone();

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);


    // This single step converts the chunked documents into vector embeddings and store these embeddings in the vector DB
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
        pineconeIndex,
        maxConcurrency : 5
    });

}

indexing();

// So indexing is done only one time as when we get the vectors in the DB we can just continue with query phase until we need to store more data in vector DB