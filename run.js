function runEsoLang(code) {
    const lines = code.split("\n");

    const keyWords = ["sendMessage", "propose", "ysws", "proposal", "true", "false"];
    const output = [];
    const varibles = {};
    const functions = {};
    let mostRecentFuncReturn;
    let mostRecentVar;

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
            };
        } else {
            // This line checks for if there are atleast 2 `(`
            if ((currentLine.match(/\(/g) || []).length >= 2) {
                // Logic for if the message is from a function
                try {
                    const funcName = currentLine.slice(12, currentLine.lastIndexOf("("));

                    if (!Object.keys(functions).includes(funcName)) {
                        return [false, "unknown function"];
                    };

                    runFunc(currentLine);

                    console.log(mostRecentFuncReturn);
                    output.push(mostRecentFuncReturn);
                } catch (e) {
                    return [false, "something"];
                };
            } else {
                // Logic for if the message is from a varible
                try {
                    const varName = currentLine.slice(12, currentLine.length - 1).trim();
                    
                    if (varibles[varName] == undefined) {
                        // console.log(Object.keys(mostRecentVar))
                        if (varName == Object.keys(mostRecentVar)[0]) {
                            console.log(mostRecentVar[varName]);
                            output.push(mostRecentVar[varName]);
                        };
                    } else {
                        console.log(varibles[varName]);
                        output.push(varibles[varName]);
                    };
                } catch (e) {
                    return [false, "something"];
                };
            };
        };
        return true;
    };

    // Func used to declare varibles
    function propose(currentLine) {
        try {
            const varName = currentLine.substring(8, currentLine.indexOf("=")).trim();
            let varVal = currentLine.substring(currentLine.indexOf("=") + 1).trim();
            
            if (keyWords.includes(varName)) {
                return [false, "reserve"];
            };

            if (varVal.startsWith('"') && varVal.endsWith('"')) {
                varibles[varName] = varVal.substring(1, varVal.length - 1);
                mostRecentVar = { [varName]: varVal.substring(1, varVal.length - 1) }
                return true;
            };
            
            if (varVal.toLowerCase() == "true") {
                varibles[varName] = true;
                mostRecentVar = { [varName]: true};
                return true;
            } else if (varVal.toLowerCase() == "false") {
                varibles[varName] = false;
                mostRecentVar = { [varName]: false };
                return true;
            };
    
            try {
                const temp = eval(`${varVal}`);
                varVal = temp;
            } catch (e) {
                // Nothing
            };

            if (typeof varVal == "number") {
                varibles[varName] = varVal;
                mostRecentVar = { [varName]: varVal };
                return true;
            };
            
            if (varVal.includes("(")) {
                switch (runFunc(currentLine)) {
                    case [false, "unknown"]:
                        return [false, "unknown"];
                    case [false, "numArgs"]:
                        return [false, "numArgs"];
                };

                varVal = mostRecentFuncReturn;
                varibles[varName] = varVal ;
                mostRecentVar = { [varName] : varVal };
            };

            if (varVal.split(" ").length > 0) {
                const temp = varVal.split(" ");

                for (let i = 0; i < temp.length; i++) {
                    if (temp[i] === 0 || temp[i] < 0 || temp[i] > 0) {
                        continue;
                    } else if (temp[i] == "+" || temp[i] == "-" || temp[i] == "*" || temp[i] == "/") {
                        continue;
                    } else if (Number(varibles[temp[i]]) !== NaN) {
                        temp[i] = varibles[temp[i]];
                    } else {
                        return [false, "math text"];
                    };
                };

                Object.assign(varibles, { [varName]: eval(`${temp.join("")}`) });
                varibles[varName] = eval(`${temp.join("")}`);
                mostRecentVar = { [varName]: eval(`${temp.join("")}`) };
                return true;
            };

            varibles[varName] = varibles[varVal];
        } catch (e) {
            return [false, "something"];
        };

        return true;
    };

    // Function declaration
    function ysws(currentLine, i) {
        try {
            const funcName = currentLine.substring(4, currentLine.indexOf("(")).trim();

            if (keyWords.includes(funcName)) {
                return [false, "reserve"];
            };

            const args = currentLine.substring(currentLine.indexOf("(") + 1, currentLine.indexOf(")")).trim().split(",");
            
            for (let j = 0; j < args.length; j++) {
                args[j] = args[j].trim();
            };

            const code = [];

            for (let j = 1; j >= 0; j++) {
                const codeLine = lines[i + j].trim();

                if (codeLine.endsWith("}")) {
                    i = j + i;
                    break;
                };

                code.push(codeLine);
            };

            functions[funcName] = [args, code];
        } catch (e) {
            return [false, "something"];
        };

        return [true, i];
    }

    // Runs code that is the code to be ran if code errors in propsal statment AND for code within functions
    function runMiniCode(catchCode) {
        if (catchCode.trim().startsWith("sendMessage(")) {
            switch (sendMessage(catchCode)) {
                case [false, ")"]:
                    console.error(`ERROR ON LINE ${i + 1} | No closing ")"`);
                    output.push(`ERROR ON LINE ${i + 1} | No closing ")"`);
                    return false;
                case [false, "something"]:
                    console.error(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    output.push(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    return false;
            };
        } else if (catchCode.startsWith("propose")) {
            switch (propose(catchCode)) {
                case [false, "reserve"]:
                    console.error(`ERROR ON LINE ${i + 1} | Can not used reserved key word for varible name`);
                    output.push(`ERROR ON LINE ${i + 1} | Can not used reserved key word for varible name`);
                    return false;
                case [false, "something"]:
                    console.error(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    output.push(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    return false;
            };
        };

        return true;
    }

    // Error handeling
    function proposal(currentLine) {
        const code = currentLine.substring(9, currentLine.indexOf(",")).trim();
        const catchCode = currentLine.substring(currentLine.indexOf(",") + 1, currentLine.length - 1).trim();

        if (code.startsWith("sendMessage(")) {
            if (!sendMessage(code)) {
                const val = runMiniCode(catchCode);
                
                if (!val) {
                    return val;
                };
            };
        } else if (code.startsWith("propose")) {
            const thing = propose(code);
            if (typeof thing == 'object' && thing[0] == false) {
                const val = runMiniCode(catchCode);
                
                if (!val) {
                    return val;
                };
            };
        };

        return true;
    };

    // Running functions
    function runFunc(currentLine) {
        let funcName = currentLine.substring(currentLine.lastIndexOf(" ", currentLine.indexOf("(")), currentLine.indexOf("(")).trim();
        let allArgs = currentLine.substring(currentLine.indexOf("(") + 1, currentLine.lastIndexOf(")"));
        
        if (funcName == "sendMessage") {
            funcName = currentLine.substring(currentLine.indexOf("sendMessage") + "sendMessage".length + 1, currentLine.lastIndexOf("(")).trim();
            allArgs = allArgs.substring(funcName.length + 1, allArgs.length - 1);
        };

        if (!Object.keys(functions).includes(funcName)) {
            return [false, "unknown"];
        };

        const args = allArgs.split(",");
        const declaredArgs = functions[funcName][0];

        if (args.length !== declaredArgs.length) {
            return [false, "numArgs"];
        };

        for (let j = 0; j < args.length; j++) {
            varibles[declaredArgs[j]] = args[j];
        };

        const funcCode = functions[funcName][1];

        for (let j = 0; j < funcCode.length; j++) {
            const currentLine = funcCode[j];

            if (currentLine.startsWith("grant")) {
                mostRecentFuncReturn = currentLine.substring(6).trim();

                try {
                    if (varibles[mostRecentFuncReturn] != undefined) {
                        mostRecentFuncReturn = varibles[mostRecentFuncReturn];
                    } else if (mostRecentVar[mostRecentFuncReturn] != undefined) {
                        mostRecentFuncReturn = mostRecentVar[mostRecentFuncReturn];
                    }
                } catch (e) {
                    return [false, "something"];
                };

                return true;
            };

            runMiniCode(currentLine);
        };
    };

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
            };
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
                default:
                    continue;
            };
        } else if (currentLine.startsWith("ysws")) {
            const returnVal = ysws(currentLine, i);

            switch (returnVal) {
                case [false, "reserve"]:
                    console.error(`ERROR ON LINE ${i + 1} | Can not used reserved key word for varible name`);
                    output.push(`ERROR ON LINE ${i + 1} | Can not used reserved key word for varible name`);
                    break mainLoop;
                case [false, "something"]:
                    console.error(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    output.push(`ERROR ON LINE ${i + 1} | Something went wrong`);
                    break mainLoop;
                default:
                    i = returnVal[1];
                    break;
            };
        } else if (currentLine.startsWith("proposal")) {
            switch (proposal(currentLine)) {
                case true:
                    break;
                default:
                    break mainLoop;
            };
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
                };
            } else if (currentLine.trim() === "") {
                continue;
            } else {
                console.error(`ERROR ON LINE ${i + 1} | UNRECONIZED SYMBOL`);
                output.push(`ERROR ON LINE ${i + 1} | UNRECONIZED SYMBOL`);
                break mainLoop;
            };
        };
    };

    return output;
};

const outputElm = document.getElementById("output");

function runProgram() {
    const code = document.getElementById("code").value;

    const output = runEsoLang(code);

    outputElm.innerHTML = "";

    for (let i = 0; i < output.length; i++) {
        outputElm.innerHTML = outputElm.innerHTML + `${output[i]}
`;
    };

    outputElm.style.visibility = "visible";
};

document.getElementById("run").addEventListener("click", runProgram);