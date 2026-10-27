
import {GoogleGenAI, Type} from '@google/genai'; 

import 'dotenv/config';

import fs from 'fs';

import path from 'path'


const ai = new GoogleGenAI({})


async function listFiles({directory})
{
    const files = [];

    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css'];

    function scan(dir)
    {

        // Used to get list of all the files in the folder

        const items = fs.readdirSync(dir);

        for(const item of items)
        {
            const fullPath = path.join(dir, item);

            // Skip node_modules, dist, build

            if(fullPath.includes('node_modules') || fullPath.includes('dist') || fullPath.includes('build'))
            {
                continue;
            }

            // Gives power to check if the current thing we have is a file or a directory

            const stat = fs.statSync(fullPath);

            if(stat.isDirectory())
            {
                scan(fullPath);
            }
            else if(stat.isFile())
            {
                const ext = path.extname(item);

                if(extensions.includes(ext))
                {
                    files.push(fullPath);
                }
            }
        }
    }

    scan(directory);

    console.log(`Found ${files.length} files`);

    return {files};
}


async function readFile({file_path})
{
    const content = fs.readFileSync(file_path, 'utf-8');

    console.log(`Reading: ${file_path}`);

    return {content};
}


async function writeFile({file_path, content})
{
    fs.writeFileSync(file_path, content, 'utf-8');

    console.log(`Fixed: ${file_path}`);

    return {success : true};
}



const listFilesTool = {
    name : "listFiles",
    description : "Get all the files in a directory",
    parameters : {
        type : Type.OBJECT,
        properties : {
            directory : {
                type : Type.STRING,
                description : "Directory path to scan"
            }
        },

        required : ['directory']
    }
};


const readFileTool = {
    name : "readFile",
    description : "Read a file's content",
    parameters : {
        type : Type.OBJECT,
        properties : {
            file_path : {
                type : Type.STRING,
                description : "Path to the file"
            }
        },

        required : ['file_path']
    }
};


const writeFileTool = {
    name : "writeFile",
    description : "Write fixed content back to a file",
    parameters : {
        type : Type.OBJECT,
        properties : {
            file_path : {
                type : Type.STRING,
                description : "Path to the file to write"
            },
            content : {
                type : Type.STRING,
                description : "The fixed/corrected content"
            }
        },

        required : ['file_path', 'content']
    }
};


const tools = [{
    functionDeclarations : [listFilesTool, readFileTool, writeFileTool]
}];

const toolFunctions = {
    "listFiles" : listFiles,
    "writeFile" : writeFile,
    "readFile" : readFile
}

const History = [];


export async function runAgent(directoryPath) 
{

    console.log(`Reviewing directory : ${directoryPath}`);

    History.push({
        role : 'user',
        parts : [{text : `Review and fix all the codes in : ${directoryPath}`}]
    });

    while(true)
    {
        const result = await ai.models.generateContent({
            model : 'gemini-3.5-flash-lite',
            contents : History,
            config : {
                systemInstruction : `
                
                # AI Code Reviewer & Fixer

Act as a senior code reviewer and security auditor. Thoroughly analyze all relevant TypeScript, JavaScript, HTML, and CSS/SCSS files in the current project.

You are only allowed to access the directory provided by the user you cannot go outside the mentioned directory.

### 1. Inspect

* Inspect the project structure, Git changes, dependencies, and available tests before editing.
* Track files discovered, analyzed, skipped, and their reasons.
* Understand related files and dependencies before identifying issues.

### 2. Review

Check for:

* Syntax errors, bugs, incorrect logic, and broken imports.
* Type safety, async errors, memory leaks, and performance issues.
* HTML semantics, accessibility, forms, and broken links.
* CSS errors, responsive layouts, overflow, and inconsistent styles.
* Cross-file integration issues and maintainability problems.
* Security risks, including XSS, injection, exposed secrets, unsafe URLs, and insecure data handling.

Classify findings by severity: Critical, High, Medium, Low, or Informational. Distinguish confirmed issues from potential risks and recommendations.

### 3. Fix

Tell all the fixes done and all the checks done

* Prioritize critical security vulnerabilities and major bugs.
* Identify the root cause before changing code.
* Apply minimal, safe fixes while preserving existing functionality and user changes.
* Inspect diffs and avoid unnecessary rewrites, dependencies, or disabled checks.
* Record each issue, affected file, change, and result.
* Never claim a fix succeeded without verification.

### 4. Validate

Run available builds, type checks, linting, tests, and relevant security checks. Fix regressions and rerun affected checks. Record actual results; mark unavailable or unexecuted checks honestly.

### 5. Final Report

Generate a detailed, evidence-based report containing:

* **File statistics:** Total discovered, eligible, analyzed, skipped, modified, fixed, and unresolved files, grouped by extension.
* **Issue statistics:** Total findings by severity and category, including fixed, partially fixed, and unresolved issues.
* **Security report:** Vulnerabilities found, severity, affected files, remediation, validation, and residual risks.
* **File-by-file summary:** File path, issues found, changes made, and validation status.
* **Fix log:** Root cause, correction, and verification for each significant issue.
* **Testing results:** Checks passed, failed, blocked, or not run.
* **Remaining work:** Unresolved issues, limitations, and recommended next steps.
* **Final assessment:** What was actually completed and verified.

Count unique files accurately. Never invent findings, statistics, test results, or security guarantees.

### Execution Rules

Use available file and terminal tools to perform actual inspections and modifications, not merely suggest commands. Execute one command per tool call when required, inspect its output, and continue step by step. Preserve project structure, avoid destructive actions, and never claim unverified success.

**Goal:** Deliver a thoroughly reviewed, securely improved, tested codebase with a transparent and accurate final audit report.


                `,
                tools
            }
        });

        if(result.functionCalls?.length > 0)
        {
            History.push(result.candidates[0].content);

            const functionResponseParts = [];

            for(const functionCall of result.functionCalls)
            {
                const {name, args} = functionCall;

                if(!toolFunctions[name])
                {
                    console.log(`Unknown Function Call : ${name}`);

                    continue;
                }

                const toolResponse = await toolFunctions[name](args);

                const functionResponsePart = {
                    name,
                    response : {
                        result : toolResponse
                    },
                    id : functionCall.id
                };

                functionResponseParts.push({
                    functionResponse : functionResponsePart
                });
            }

            if(functionResponseParts.length > 0)
            {
                History.push({
                    role : 'user',
                    parts : functionResponseParts
                })
            }
        }
        else
        {
            History.push({
                role : "model",
                parts : [{text : result.text}]
            })

            console.log(result.text);

            break;
        }
    }
}

// So we can only run this by mentioning the directory to be reviewed or file to be reviewed so we will give relative path of directory

// [node agent.js ../tester] so in this command the node is index 0, agent.js is index 1 and directory relative path is index 3

// So we get the directory path by using process.argv[2] 

const directory = process.argv[2] || '.';

await runAgent(directory);