import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import { createJavaScriptFunction, createVaribleJs, createClassJs, commentJs, constantJs, objectJs, initializeJs, printJs } from '../datamodules/DataCollections';
import { useState, useEffect } from "react";

export default function VoiceGet() {

    const [resetKey, setResetKey] = useState(0);
    const [textToCopy, setTextToCopy] = useState();
    const [isCopied, setCopied] = useClipboard(textToCopy, {
        successDuration: 5000
    });
    const [afterHello, setAfterHello] = useState(null);

    const [keywords, setKeywords] = useState('');

    const [codeEditor, setCodeEditor] = useState(false);

    const [isListening, setIsListening] = useState(false);
    const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();


    useEffect(() => {

        if (transcript) {
            if (transcript.toLowerCase().startsWith('create function')) {
                const functionName = transcript.toLowerCase().replace('create function', '').trim();
                if (functionName) {
                    setKeywords(createJavaScriptFunction(functionName));
                    setIsListening(false)
                }
            }
            else if (transcript.toLowerCase().startsWith('declare a variable')) {
                const varibleName = transcript.toLowerCase().replace('declare a variable', '').trim();

                if (varibleName) {
                    setKeywords(createVaribleJs(varibleName))
                    setIsListening(false)
                }
            }
            else if (transcript.toLowerCase().startsWith('constant')) {
                const varibleName = transcript.toLowerCase().replace('constant', '').trim();

                if (varibleName) {
                    setKeywords(constantJs(varibleName))
                    setIsListening(false)
                }
            }
            else if (transcript.toLowerCase().startsWith('create class')) {
                const varibleName = transcript.toLowerCase().replace('create class', '').trim();
                if (varibleName) {
                    setKeywords(createClassJs(varibleName))
                    setIsListening(false)
                }

            }
            else if (transcript.toLowerCase().startsWith('comment')) {
                const varibleName = transcript.toLowerCase().replace('comment', '').trim();
                if (varibleName) {
                    setKeywords(commentJs(varibleName))
                    setIsListening(false)
                }

            }
            else if (transcript.toLowerCase().startsWith('create object')) {
                const varibleName = transcript.toLowerCase().replace('create object', '').trim();
                if (varibleName) {
                    setKeywords(objectJs(varibleName))
                    setIsListening(false)
                }

            }
            else if (transcript.toLowerCase().startsWith('initialise')) {
                const varibleName = transcript.toLowerCase().replace('initialise', '').trim();
                if (varibleName) {
                    setKeywords(initializeJs(varibleName))
                    setIsListening(false)
                }

            }
            else if (transcript.toLowerCase().startsWith('print')) {
                const varibleName = transcript.toLowerCase().replace('print', '').trim();
                if (varibleName) {
                    setKeywords(printJs(varibleName))
                    setIsListening(false)
                }

            }


            else {
                setKeywords('Unrecognized command');
                setIsListening(false);
            }
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

        <div className="container" style={{ width: '30%', float: 'right', paddingRight: '5px' }}>
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