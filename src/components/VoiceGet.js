import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import { createJavaScriptFunction, helloworld, createVaribleJs } from '../datamodules/DataCollections';
import { useState, useEffect } from "react";

export default function VoiceGet() {


    const [textToCopy, setTextToCopy] = useState();
    const [isCopied, setCopied] = useClipboard(textToCopy, {
        successDuration: 5000
    });
    const [afterHello, setAfterHello] = useState(null);

    const [keywords, setKeywords] = useState('');

    const [codeEditor, setCodeEditor] = useState(false);

    const [isListening, setIsListening] = useState(false);
    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    useEffect(() => {

        if (transcript) {
            if (transcript.toLowerCase().startsWith('create function')) {
                const functionName = transcript.toLowerCase().replace('create function', '').trim();
                if (functionName) {
                    setKeywords(createJavaScriptFunction(functionName));
                    setIsListening(false)
                }
            }
            if (transcript.toLowerCase().startsWith('print hello world')) {
                setKeywords(helloworld());
                setIsListening(false)
            }

            if (transcript.toLowerCase().startsWith('declare a variable')) {
                const varibleName = transcript.toLowerCase().replace('declare a variable', '').trim();

                if (varibleName) {
                    setKeywords(createVaribleJs(varibleName))
                    setIsListening(false)
                }

            }
        }
    }, [transcript]);


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