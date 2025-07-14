function runEsoLang(code) {
    const lines = code.split("\n");

    const keyWords = ["sendMessage", "propose", "ysws", "proposal", "true", "false"];
    const output = [];
    const varibles = {};
    const functions = {};
    let mostRecentFuncReturn;

    // Func used to print stuff
    function sendMessage(currentLine) {
        const isMessageStr = currentLine.indexOf('"') === -1 ? false : true;

        // Logic for if the message is a string (instead of var)
        if (isMessageStr) {
            try {
                const message = currentLine.substring(13, currentLine.lastIndexOf('"'));

                if (!currentLine.slice(-1) === ")") {
                    return [false, ")"];
                }

                console.log(message);
                output.push(message);
            } catch (e) {
                return [false, "something"];
            }
        } else {
            // This line checks for if there are atleast 4 `(`
            if ((currentLine.match(/\(/g) || []).length >= 4) {
                // Logic for if the message is from a function
                try {
                    const funcName = currentLine.slice(12, currentLine.length - 1);

                    if (!Object.keys(functions).includes(funcName)) {
                        return [false, "unknown function"];
                    }

                    runFunc(currentLine);
                } catch (e) {
                    return [false, "something"];
                }
            } else {
                // Logic for if the message is from a varible
                try {
                    const varName = currentLine.slice(12, currentLine.length - 1);

                    console.log(varibles[varName]);
                    output.push(varibles[varName]);
                } catch (e) {
                    return [false, "something"];
                }
            }
        }
        return true;
    }

    // Func used to declare varibles
    function propose(currentLine) {
        try {
            const varName = currentLine.substring(8, currentLine.indexOf("=")).trim();
            let varVal = currentLine.substring(currentLine.indexOf("=") + 1).trim();

            if (keyWords.includes(varName)) {
                return [false, "reserve"];
            }

            if (varVal.startsWith('"') && varVal.endsWith('"')) {
                varibles[varName] = varVal.substring(1, varVal.length - 1);
                return true;
            }
            
            if (varVal.toLowerCase() == "true") {
                varibles[varName] = true;
                return true;
            } else if (varVal.toLowerCase() == "false") {
                varibles[varName] = false;
                return true;
            }
    
            try {
                const temp = eval(`${varVal}`);
                varVal = temp;
            } catch (e) {
                // Nothing
            }

            if (typeof varVal == "number") {
                varibles[varName] = varVal;
            }

            if (varVal.includes("(")) {
                switch (runFunc(currentLine)) {
                    case [false, "unknown"]:
                        return [false, "unknown"];
                    case [false, "numArgs"]:
                        return [false, "numArgs"];
                }
                varVal = mostRecentFuncReturn;
            }

            if (varVal.split(" ").length > 0) {
                const temp = varVal.split(" ");

                for (let i = 0; i < temp.length; i++) {
                    if (Number(temp[i]) != NaN) {
                        if (typeof varibles[temp[i]] == "number") {
                            temp[i] = varibles[temp[i]];
                        } else if (temp[i] != "+" || temp[i] != "-" || temp[i] != "*" || temp[i] != "/") {
                            continue;
                        } else {
                            return [false, "math text"]
                        }
                    }
                }

                varibles[varName] = eval(`${temp.join("")}`);
            }

            varibles[varName] = varibles[varVal];
        } catch (e) {
            return [false, "something"];
        }
        return true;
    }

    // Function declaration
    function ysws(currentLine, i) {
        try {
            const funcName = currentLine.substring(4, currentLine.indexOf("(")).trim();

            if (keyWords.includes(funcName)) {
                return [false, "reserve"];
            }

            const args = currentLine.substring(currentLine.indexOf("(") + 1, currentLine.indexOf(")")).trim().split(",");
            
            for (let i = 0; i < args.length; i++) {
                args[i] = i.trim();
            }

            const code = [];

            for (let j = 1; j >= 0; j++) {
                const codeLine = lines[i + j].trim();

                if (codeLine.endsWith("}")) {
                    i = i + j;
                    break;
                }

                code.push(codeLine);
            }

            functions[funcName] = [args, code];
        } catch (e) {
            return [false, "something"];
        }
        return true;
    }

    // Runs code that is the code to be ran if code errors in propsal statment AND for code within functions
    function runMiniCode(catchCode) {
        if (code.startsWith("sendMessage(")) {
            switch (sendMessage(catchCode)) {
                case [false, ")"]:
                    console.error(`ERROR ON LINE ${i + 1} | No closing ")"`);
                    output.push(`ERROR ON LINE ${i + 1} | No closing ")"`);
                    break;
                case [false, "something"]:
                    console.error(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    output.push(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    break;
            }
        } else if (code.startsWith("propose")) {
            switch (propose(catchCode)) {
                case [false, "reserve"]:
                    console.error(`ERROR ON LINE ${i + 1} | Can not used reserved key word for varible name`);
                    output.push(`ERROR ON LINE ${i + 1} | Can not used reserved key word for varible name`);
                    break;
                case [false, "something"]:
                    console.error(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    output.push(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    break;
            }
        }
    }

    // Error handeling
    function proposal(currentLine) {
        const code = currentLine.substring(10, currentLine.indexOf(",")).trim();
        const catchCode = currentLine.substring(currentLine.indexOf(",") + 1, currentLine.length - 1);

        if (code.startsWith("sendMessage(")) {
            switch(sendMessage(code)) {
                case !true:
                    const val = runMiniCode(catchCode);
                    
                    if (!val) {
                        return val;
                    }

                    break;
            }
        } else if (code.startsWith("propose")) {
            switch(propose(code)) {
                case !true:
                    const val = runMiniCode(catchCode);
                    
                    if (!val) {
                        return val;
                    }

                    break;
            }
        }

        return true;
    }

    // Running functions
    function runFunc(currentLine) {
        const funcName = currentLine.substring(0, currentLine.indexOf("(")).trim();

        if (!Object.keys(functions).includes(funcName)) {
            return [false, "unknown"];
        }

        const allArgs = currentLine.substring(currentLine.indexOf("(") + 1, currentLine.lastIndexOf(")"));
        const args = allArgs.split(",");
        const declaredArgs = functions[funcName][0];

        if (args.length !== declaredArgs.length) {
            return [false, "numArgs"];
        }

        for (let j = 0; j < args.length; j++) {
            varibles[declaredArgs[j]] = args[j];
        }

        const funcCode = functions[funcName][1];

        for (let j = 0; j < funcCode.length; j++) {
            const currentLine = funcCode[j];

            if (currentLine.startsWith("return")) {
                mostRecentFuncReturn = currentLine.substring(6).trim();
                return true;
            }

            runMiniCode(currentLine);
        }
    }

    // Loops through all lines of code to run it
    mainLoop: for (var i = 0; i < lines.length; i++) {
        const currentLine = lines[i].trim();

        if (currentLine.startsWith("sendMessage(")) {
            switch (sendMessage(currentLine)) {
                case [false, ")"]:
                    console.error(`ERROR ON LINE ${i + 1} | No closing ")"`);
                    output.push(`ERROR ON LINE ${i + 1} | No closing ")"`);
                    break mainLoop;
                case [false, "something"]:
                    console.error(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    output.push(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    break mainLoop;
                case [false, "unknown function"]:
                    console.error(`ERROR ON LINE ${i + 1} | Function with that name not found`);
                    output.push(`ERROR ON LINE ${i + 1} | Function with that name not found`);
                    break mainLoop;
            }
        } else if (currentLine.startsWith("propose")) {
            switch (propose(currentLine)) {
                case [false, "reserve"]:
                    console.error(`ERROR ON LINE ${i + 1} | Can not used reserved key word for varible name`);
                    output.push(`ERROR ON LINE ${i + 1} | Can not used reserved key word for varible name`);
                    break mainLoop;
                case [false, "something"]:
                    console.error(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    output.push(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    break mainLoop;
                case [false, "unknown function"]:
                    console.error(`ERROR ON LINE ${i + 1} | Function with that name not found`);
                    output.push(`ERROR ON LINE ${i + 1} | Function with that name not found`);
                    break mainLoop;
                case [false, "math text"]:
                    console.error(`ERROR ON LINE ${i + 1} | You tried to do math with a string`);
                    output.push(`ERROR ON LINE ${i + 1} | You tried to do math with a string`);
                    break mainLoop;
            }
        } else if (currentLine.startsWith("ysws")) {
            switch (ysws(currentLine, i)) {
                case [false, "reserve"]:
                    console.error(`ERROR ON LINE ${i + 1} | Can not used reserved key word for varible name`);
                    output.push(`ERROR ON LINE ${i + 1} | Can not used reserved key word for varible name`);
                    break mainLoop;
                case [false, "something"]:
                    console.error(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    output.push(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    break mainLoop;
            }
        } else if (currentLine.startsWith("proposal")) {
            switch (proposal(currentLine)) {
                case true:
                    break;
                default:
                    break mainLoop;
            }
        } else {
            if (currentLine.indexOf("(") !== -1) {
                switch (runFunc(currentLine)) {
                    case [false, "unknown"]:
                        console.error(`ERROR ON LINE ${i + 1} | UNRECONIZED SYMBOL`);
                        output.push(`ERROR ON LINE ${i + 1} | UNRECONIZED SYMBOL`);
                        break mainLoop;
                    case [false, "numArgs"]:
                        console.error(`ERROR ON LINE ${i + 1} | Number of args does not match function declaration`);
                        output.push(`ERROR ON LINE ${i + 1} | Number of args does not match function declaration`);
                        break mainLoop;
                }
            } else {
                console.error(`ERROR ON LINE ${i + 1} | UNRECONIZED SYMBOL`);
                output.push(`ERROR ON LINE ${i + 1} | UNRECONIZED SYMBOL`);
                break mainLoop;
            }
        }
    }

    return output;
};

const outputElm = document.getElementById("output");

function runProgram() {
    const code = document.getElementById("code").value;

    const output = runEsoLang(code);

    outputElm.innerHTML = "";

    for (let i = 0; i < output.length; i++) {
        outputElm.innerHTML = outputElm.innerHTML + `${output[i]} <br />`;
    };

    outputElm.style.visibility = "visible"
};

document.getElementById("run").addEventListener("click", runProgram);