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

export function createVaribleJs(varibleName) {
    // Your function implementation
    const functionText = `
        var ${varibleName};
    `;
    return functionText;

}
export function createClassJs(varibleName) {
    // Your function implementation
    const functionText = `
       class ${varibleName} {
            constructor() {}
        }
 `;
    return functionText;

}

export function commentJs(varibleName) {
    // Your function implementation
    const functionText = `
       //${varibleName}
 `;
    return functionText;

}

export function constantJs(varibleName) {
    // Your function implementation
    const functionText = `
        const ${varibleName};
    `;
    return functionText;

}

export function objectJs(varibleName) {
    // Your function implementation
    const functionText = `
       const ${varibleName} = {//Enter your attributes};
    `;
    return functionText;

}

export function initializeJs(varibleName) {
    // Your function implementation

    if (varibleName === Number) {
        const functionText = `
       = ${varibleName};
    `;
        return functionText;

    }
    else {
        const functionText = `
       = '${varibleName}';
    `;
        return functionText;
    }

}

export function printJs(varibleName) {
    // Your function implementation
    const functionText = `
       console.log('${varibleName}');
    `;
    return functionText;

}
