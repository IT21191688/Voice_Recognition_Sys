import React, { useState, useEffect, useContext } from 'react';
import CodeMirror from 'codemirror'; // Import CodeMirror correctly
import CodeMirrorEditor from '../services/CodeMirrorEditor';
import { GlobalContext } from '../services/GlobleContext'; // Correct the import path
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import {
    createJavaScriptFunction, createVaribleJs, createClassJs, commentJs, constantJs, objectJs, initializeJs, printJs, createForLoopJs, createIfElseJs, executeCode,
    createJavaFunction, createClassJava, createCommentJava, createConstantJava, createForLoopJava, createIfElseJava, createObjectJava, createVariableJava, initializeJava, printJava
} from '../datamodules/DataCollections';


import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/mode/javascript/javascript.js';

import Style from '../styles/EditorStyle.module.css'

let myCodeMirror = null;




function Editor(props) {


    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [codeValue, setCodeValue] = useState('');
    //const [resetKey, setResetKey] = useState(0);
    const [textToCopy, setTextToCopy] = useState();
    const [isCopied, setCopied] = useClipboard(textToCopy, {
        successDuration: 5000
    });

    const [keywords, setKeywords] = useState('');
    const [language, setlanguage] = useState('Javascript');
    const [isListening, setIsListening] = useState(false);
    const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

    const [codeEditor, setCodeEditor] = useState(false);


    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 3; // Number of pages in the guide

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            alert(currentPage)
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const languageCommandHandlers = {
        'Javascript': {
            'create function': createJavaScriptFunction,
            'declare variable': createVaribleJs,
            'constant': constantJs,
            'create class': createClassJs,
            'comment': commentJs,
            'create object': objectJs,
            'initialize': initializeJs,
            'print': printJs,
            'create loop': createForLoopJs,
            'create if else': createIfElseJs,
            'execute': executeCode
        },
        'Java': {
            'create function': createJavaFunction,
            'declare variable': createVariableJava,
            'constant': createConstantJava,
            'create class': createClassJava,
            'comment': createCommentJava,
            'create object': createObjectJava,
            'initialize': initializeJava,
            'print': printJava,
            'create loop': createForLoopJava,
            'create if else': createIfElseJava,
        },
    };



    //create loop with condition i less than
    //create if else statement with condition x greater than 5

    function extractConditionFromArgument(argument) {
        const conditionIndex = argument.indexOf('with condition');

        if (conditionIndex !== -1) {
            const conditionText = argument.substring(conditionIndex + 'with condition'.length).trim();

            if (conditionText.includes('greater than or equal to')) {
                return conditionText.replace('greater than or equal to', '>=').trim();
            } else if (conditionText.includes('less than or equal to')) {
                return conditionText.replace('less than or equal to', '<=').trim();
            } else if (conditionText.includes('greater than')) {
                return conditionText.replace('greater than', '>').trim();
            } else if (conditionText.includes('less than')) {
                return conditionText.replace('less than', '<').trim();
            }
        }

        return '';


    }
    // Return an empty string if no valid condition is found
    //"create if else statement with condition x greater than 0"

    function processTranscript(transcript) {
        const normalizedTranscript = transcript.toLowerCase();
        const selectedLanguageHandlers = languageCommandHandlers[language];

        for (const command in selectedLanguageHandlers) {
            if (normalizedTranscript.startsWith(command)) {
                const argument = normalizedTranscript.replace(command, '').trim();

                if (normalizedTranscript == "execute") {
                    executeCode();
                }
                if (argument) {
                    let keyword = '';

                    if (command === 'create loop' || command === 'create if else') {
                        const condition = extractConditionFromArgument(argument);
                        keyword = selectedLanguageHandlers[command](condition);
                    } else {
                        keyword = selectedLanguageHandlers[command](argument);
                    }

                    setKeywords(keyword);
                    setIsListening(false);
                    return;
                }
            }
        }

        setKeywords('Unrecognized command');
        setIsListening(false);
    }

    useEffect(() => {


        if (transcript) {
            processTranscript(transcript);
        }


    }, [transcript]);

    useEffect(() => {



        if (!myCodeMirror) {
            const myCodeMirrorInstance = CodeMirror(document.querySelector('#code-editor'), {
                lineNumbers: true,
                mode: 'javascript',
                styleActiveLine: true,
                matchBrackets: true,
                theme: 'idea',
                indentUnit: 4,
            });

            myCodeMirror = myCodeMirrorInstance; // Set the myCodeMirror variable

            CodeMirrorEditor.setEditor(myCodeMirrorInstance);

            myCodeMirrorInstance.setValue('// your code will be written here');

        }


        CodeMirrorEditor.onRunCode({
            before: () => setLoading(true),
            success: (result) => setResult(result),
            error: (ex) => setResult(ex.toString()),
            after: () => setLoading(false)
        });

        // Remove + codeValue

        // Attach a change event listener to the CodeMirror instance
        setResult('');
    }, []);

    const rejectCode = () => {
        setTextToCopy('');
        setKeywords('');
        resetTranscript();
    }

    const startListening = () => {
        SpeechRecognition.startListening({ continuous: true, language: 'en-IN' })
        setIsListening(true);
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
        setIsListening(false);
    };

    if (!browserSupportsSpeechRecognition) {
        return null
    }

    const setValue = (e) => {

        setCodeValue(e.target.value);

    }

    const handleCodeChange = (editor) => {
        setCodeValue(editor.getValue()); // Update the codeValue state
    };

    const applyGeneratedCode = () => {
        if (keywords) {

            const currentCursor = myCodeMirror.getCursor();
            const currentCode = myCodeMirror.getValue();

            // Get the lines before and after the current cursor position
            const linesBeforeCursor = currentCode.split('\n').slice(0, currentCursor.line + 1);
            const linesAfterCursor = currentCode.split('\n').slice(currentCursor.line + 1);

            // Insert the generated code at the current cursor position
            const newCodeLines = [...linesBeforeCursor, keywords, ...linesAfterCursor];
            const newCode = newCodeLines.join('\n');

            myCodeMirror.setValue(newCode);
            // Set the new code to the editor

            // Set cursor to the end of the inserted code
            const newCursor = { line: currentCursor.line + keywords.split('\n').length - 1, ch: keywords.length };
            myCodeMirror.setCursor(newCursor); // Set the cursor position
            setKeywords('');
        }
    };




    return (
        <div className='row mt-5'>


            <div className={`container col-md-3 ${Style['voice-guide-container']}`}>
                <h2 className={Style['voice-guide-heading']}>Voice Command Guide</h2>
                <div className={`${Style['voice-guide-page']} ${currentPage === 0 ? Style.active : ''}`}>
                    <p className={Style['voice-guide-text']}>Follow these steps to use the voice command interface:</p>
                    <ol className={Style['voice-guide-list']}>
                        <li>Select a programming language from the dropdown.</li>
                        <li>Click the "Start Listening" button to activate voice recognition.</li>
                        <li>Speak one of the supported commands, like "create function" or "declare variable".</li>
                        <li>Your spoken command will be processed and code snippets will be generated.</li>
                        <li>Generated code will appear in the editor. You can manually edit it if needed.</li>
                        <li>Click the "Apply Code" button to insert the generated code into the editor.</li>
                        <li>Click the "Run Code" button to execute the code and see the output.</li>
                    </ol>
                </div>
                <div className={`${Style['voice-guide-page']} ${currentPage === 1 ? Style.active : ''}`}>
                    <ul className={Style['voice-guide-list']}>
                        <li><strong>"create function":</strong> Generates a function template.</li>
                        <li><strong>"declare variable":</strong> Generates a variable declaration.</li>
                        {/* Add more examples here */}
                    </ul>
                    <p className={Style['voice-guide-text']}>Here are some example commands:</p>
                    {/* ... Other content for Page 2 */}
                </div>
                <div className={`${Style['voice-guide-page']} ${currentPage === 2 ? Style.active : ''}`}>
                    <ul className={Style['voice-guide-list']}>
                        <li><strong>"create loop with condition i less than 10":</strong> Generates a for loop with the specified condition.</li>
                        <li><strong>"create if else statement with condition x greater than 5":</strong> Generates an if-else statement with the specified condition.</li>
                        <li><strong>"print variableName":</strong> Generates a console log statement to print the specified variable.</li>
                        <li><strong>"create constant":</strong> Generates a constant declaration.</li>
                        <li><strong>"create object with attributes name and age":</strong> Generates an object declaration with attributes.</li>
                        <li><strong>"initialize variableName with Number":</strong> Generates variable initialization with a specified type.</li>
                        <li><strong>"comment":</strong> Generates a comment.</li>
                        {/* Add more examples here */}
                    </ul>
                    <h4 className={Style['voice-guide-subheading']}>Example Voice Commands:</h4>
                    {/* ... Other content for Page 3 */}
                </div>
                <button onClick={prevPage}>Previous</button>
                <button onClick={nextPage}>Next</button>
            </div>
            <div className="container col-md-6" style={{ paddingRight: '5px' }}>
                <div className={`${Style.codeeditorwrapper}`}>
                    <div className={Style.filename}>
                        My Code Editor
                        <span
                            onClick={() => CodeMirrorEditor.runCode()}
                            title="Click here to run this file"
                            className={`${loading ? Style.loading : ''}`}
                        >
                            {loading && <i className={`fa fa-circle-o-notch fa-spin fa-3x ${Style.loadingIcon}`}></i>}
                            {!loading && <i className={`fa fa-caret-right ${Style.caretIcon}`} />}
                        </span>
                    </div>
                    <div id="code-editor" className={`${Style.CodeMirror}`} style={{ textAlign: 'left' }} onChange={setValue}></div>
                </div>
                <div className={`output ${loading ? Style.loading : ''} p-3 border rounded`}>
                    <div className="d-flex align-items-center">
                        <i className={`fa fa-angle-right ${Style.angleIcon} mr-2`}></i>
                        {loading ? (
                            <span className={`fa-3x ${Style.loadingIcon}`}>
                                <i className="fa fa-circle-o-notch fa-spin"></i>
                            </span>
                        ) : (
                            <pre className="m-0">{result === '' ? 'Empty output' : result}</pre>
                        )}
                    </div>
                </div>
            </div>

            <div className="container col-md-3" style={{ width: '20%', float: 'right', paddingRight: '5px' }}>
                <div className="dropdown mb-3">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        Select Language: {language}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a className="dropdown-item" href="#" onClick={() => setlanguage('Javascript')}>Javascript</a></li>
                        <li><a className="dropdown-item" href="#" onClick={() => setlanguage('Java')}>Java</a></li>
                    </ul>
                </div>
                <h2 className="mb-3">Say Your Code</h2>

                <div
                    className="main-content mb-3 p-2 border"
                    style={{ height: '50px', cursor: 'pointer' }}
                    onClick={() => setTextToCopy(transcript)}
                >
                    {transcript}
                </div>
                <hr />

                <div className="main-content mb-3 p-2 border" style={{ height: '200px' }}>
                    {keywords}
                </div>

                <div className="mb-3">
                    <button className="btn btn-primary me-2" onClick={applyGeneratedCode}>
                        Apply Code
                    </button>
                    <button className="btn btn-secondary" onClick={rejectCode}>
                        Clear
                    </button>
                </div>

                <div className="btn-style">
                    <button
                        className={`btn ${isCopied ? 'btn-success' : 'btn-primary'} me-2`}
                        onClick={setCodeEditor}
                    >
                        {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>

                    <button
                        className={`btn ${isListening ? 'btn-danger' : 'btn-success'}`}
                        onClick={isListening ? stopListening : startListening}
                    >
                        {isListening ? 'Stop Listening' : 'Start Listening'}
                    </button>
                </div>
            </div>

        </div>


    );
}

export default React.memo(Editor);
