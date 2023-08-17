import React from "react";
import CodeMirrorEditor from '../services/CodeMirrorEditor';

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


export function createForLoopJs(condition) {
    const loopText = `
        for (${condition}) {
            // Your loop body here
        }
    `;
    return loopText;
}

export function createIfElseJs(condition) {
    const functionText = `
        if (${condition}) {
            // Your if block code here
        } else {
            // Your else block code here
        }
    `;
    return functionText;
}

//java


export function createJavaFunction(functionName) {
    const functionText = `public void ${functionName}() {\n    // Your function implementation here\n}\n`;
    return functionText;
}

export function createVariableJava(variableName) {
    const variableText = `int ${variableName};\n`;
    return variableText;
}

export function createClassJava(className) {
    const classText = `public class ${className} {\n    // Constructor\n    public ${className}() {\n    }\n}\n`;
    return classText;
}

export function createCommentJava(commentText) {
    const comment = `// ${commentText}\n`;
    return comment;
}

export function createConstantJava(constantName) {
    const constantText = `final int ${constantName} = 0;\n`;
    return constantText;
}

export function createObjectJava(objectName) {
    const objectText = `Object ${objectName} = new Object();\n`;
    return objectText;
}

export function initializeJava(variableName) {
    const initialization = `int ${variableName} = 0;\n`;
    return initialization;
}

export function printJava(variableName) {
    const printStatement = `System.out.println(${variableName});\n`;
    return printStatement;
}

export function createForLoopJava(condition) {
    const loopText = `for (${condition}) {\n    // Your loop body here\n}\n`;
    return loopText;
}

export function createIfElseJava(condition) {
    const ifElseText = `if (${condition}) {\n    // Your if block code here\n} else {\n    // Your else block code here\n}\n`;
    return ifElseText;
}

export function executeCode() {

    CodeMirrorEditor.runCode()

}

