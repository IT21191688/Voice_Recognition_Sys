import React from "react";


export function createJavaScriptFunction(functionName) {
    // Your function implementation
    const functionText = `
        function ${functionName}() {
            // Your function implementation here
        }
    `;
    return functionText;

}

export function helloworld() {
    // Your function implementation
    const functionText = `console.log("hello world");`;
    return functionText;

}

export function createVaribleJs(varibleName) {
    // Your function implementation
    const functionText = `
        var ${varibleName};
    `;
    return functionText;

}




