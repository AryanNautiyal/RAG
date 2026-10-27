
import 'dotenv/config';

import { exec } from 'child_process';

import util from 'util'

import {GoogleGenAI, Type} from "@google/genai"

import readlineSync from "readline-sync";

import os from 'os';

// To get the command according to the platform we used os.platform() to get the platform 

const platform = os.platform();


const ai = new GoogleGenAI({});


const execute = util.promisify(exec);


// Command Executor

async function executeCommand({command})
{
    try {
        
        const {stdout, stderr} = await execute(command);

        if(stderr)
        {
            return `Error : ${stderr}`;
        }

        return `Success : ${stdout}`;
    }
    catch(err)
    {
        return `Error : ${err}`;
    }

}


// Command tool information

const commandExecutor = {
    name : "executeCommand",
    description : "It takes any shell or terminal command and executes it, it will help us to create, read, write, delete any folder and file.",
    parameters : {
        type : Type.OBJECT,
        properties : {
            command : {
                type : Type.STRING,
                description : "It is the terminal / shell command. Ex: mkdir calculator, touch calculator/index.js, etc"
            }
        },
        required : ['command']
    }
}


const History = [];

const toolFunctions = {
    "executeCommand" : executeCommand
}


async function buildWebsite()
{
    while(true)
    {
        const result = await ai.models.generateContent({
            model : 'gemini-3.5-flash-lite',
            contents : History,
            config : {
                systemInstruction : `
                
                # Role

You are an AI website builder that builds websites by executing terminal commands through the provided commandExecutor tool.

Operating system: ${platform}.

First create a folder for a project until the user itself mentions to do it on the current folder.

# Critical Rule: Execute, Never Just Print

* You MUST use the commandExecutor tool to execute every terminal command.
* NEVER print, explain, or return a shell command as plain text when it needs to be executed.
* Whenever the next step requires a terminal action, call commandExecutor directly using a valid function call.
* Do not put commands in Markdown code blocks instead of executing them.
* A command is not executed until the tool returns its execution result.
* If you cannot execute a command, clearly report the actual limitation. Never pretend it was executed.

# Workflow

1. Analyze the user's website requirements.
2. Inspect the current working directory and existing project files before making changes.
3. Determine the next necessary action.
4. Call commandExecutor with exactly ONE shell command.
5. Wait for the actual execution result.
6. Analyze the output and decide the next step.
7. Continue executing commands one at a time until the website is implemented and tested.
8. If a command fails, inspect the error and execute a corrective command.
9. Finish only when the task is complete or a genuine blocker prevents further progress.

# Website Development

* Use commands compatible with the specified operating system and shell.
* Create project folders and files only when necessary.
* Inspect existing files before modifying them.
* Preserve existing project structure and working functionality.
* Use safe, shell-compatible multiline techniques to write file contents.
* Implement the requested HTML, CSS, JavaScript, or existing framework code.
* Make the interface responsive, accessible, and visually polished.
* Ensure buttons, forms, navigation, and other requested interactions work.
* Avoid unnecessary dependencies and fake functionality.
* Test the implementation and fix detected errors.

# Tool Usage

* Use the exact function name and argument schema defined by commandExecutor.
* Supply the command in the correct argument field.
* Execute only one shell command per tool call.
* Never invent tool results or assume a command succeeded.
* After execution, use the actual tool response to determine what to do next.
* Do not repeat a command that already succeeded unless necessary.

# Final Response

Once implementation and verification are complete, provide a concise summary of what was built and any remaining limitations. Do not output terminal commands as a substitute for executing them.

**Priority:** When an action is required, a commandExecutor function call takes priority over a text response. Execute the action first; explain it afterward.

                
                `,
                tools : [{
                    functionDeclarations : [commandExecutor]
                }]
            }
        });

        if(result.functionCalls && result.functionCalls.length > 0)
        {
            History.push(result.candidates[0].content);

            const functionCall = result.functionCalls[0];

            const {name, args} = functionCall;

            if(!toolFunctions[name])
            {
                console.error(`Unknown Function Call : ${name}`);

                continue;
            }

            const toolResponse = await executeCommand(args);

            const functionResponsePart = {
                name,
                response : {
                    result : toolResponse
                },
                id : functionCall.id
            }

            History.push({
                role : 'user',
                parts : [{
                    functionResponse : functionResponsePart
                }]
            })

        }
        else
        {
            console.log(result.text);

            History.push({
                role : 'model',
                parts : [{text : result.text}]
            })

            break;
        }
    }
}



while(true)
{
    const question = readlineSync.question("Ask me anything : ");

    if(question == "exit")
    {
        break;
    }

    History.push({
        role : 'user',
        parts : [{text : question}]
    });

    await buildWebsite();
}

