import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import {
    createJavaScriptFunction, createVaribleJs, createClassJs, commentJs, constantJs, objectJs, initializeJs, printJs, createForLoopJs, createIfElseJs,
    createJavaFunction, createClassJava, createCommentJava, createConstantJava, createForLoopJava, createIfElseJava, createObjectJava, createVariableJava, initializeJava, printJava
} from '../datamodules/DataCollections';
import { useState, useEffect } from "react";
import Editor from './Editor';

export default function VoiceGet() {

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


    return (<>

        <div className="container" style={{ width: '50%', float: 'left', paddingRight: '5px' }}>
            <div>

            </div>
        </div>

        <div className="container" style={{ width: '30%', float: 'right', paddingRight: '5px' }}>


            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    Select Language: {language}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a className="dropdown-item" href="#" onClick={() => setlanguage('Javascript')}>Javascript</a></li>
                    <li><a className="dropdown-item" href="#" onClick={() => setlanguage('Java')}>Java</a></li>
                </ul>
            </div>
            <h2>Say Your Code</h2>

            <br />
            <div
                className="main-content"
                style={{ height: '50px', border: '1px solid black' }}
                onClick={() => setTextToCopy(transcript)}
            >
                {transcript}
            </div>
            <hr></hr>
            <div
                className="main-content"
                style={{ height: '200px', border: '1px solid black' }}
            >
                {keywords}
            </div>
            <div>
                <button onClick={setCopied}>
                    Apply Code
                </button>
                <button onClick={rejectCode}>
                    Clear
                </button>
            </div>

            <div className="btn-style">
                <button onClick={setCodeEditor}>
                    {isCopied ? 'Copied!' : 'Copy to clipboard'}
                </button>

                <button
                    onClick={isListening ? stopListening : startListening}
                    style={{ backgroundColor: isListening ? 'red' : 'green' }}
                >
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                </button>
            </div>

        </div>

    </>

    )


} 