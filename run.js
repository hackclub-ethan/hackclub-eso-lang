function runEsoLang(code) {
    const lines = code.split("\n");

    const keyWords = ["sendMessage", "propose", "ysws", "proposal", "proposalRejected"];
    const varibles = {};
    const functions = {};

    for (let i = 0; i < lines.length; i++) {
        const currentLine = lines[i].trim();

        // print function
        if (currentLine.startsWith("sendMessage(")) {
            const isMessageStr = currentLine.indexOf('"') === -1 ? false : true;

            // Logic for if the message is a string (instead of var)
            if (isMessageStr) {
                const message = currentLine.substring(14, currentLine.lastIndexOf('"'));

                if (!currentLine.slice(-1) === ")") {
                    // error for no closing `)`
                }

                console.log(message)
            } else {
                // Logic for if the message is from a varible.
                const varName = currentLine.slice(13, currentLine.length - 1);

                console.log(varibles[varName]);
            }
        } else if (currentLine.startsWith("propose")) {
            const varName = currentLine.substring(8, currentLine.indexOf("=")).trim();
            let varVal = currentLine.substring(currentLine.indexOf("=") + 1).trim();

            if (keyWords.includes(varName)) {
                // Error for using reserved keywords for var names
            }
            
            if (varVal.toLowerCase() == "true") {
                varibles[varName] = true;
                continue;
            } else if (varVal.toLowerCase() == "false") {
                varibles[varName] = false;
                continue;
            }
    
            try {
                const temp = eval(`${varVal}`);
                varVal = temp;
            } catch (e) {
                // Nothing
            }

            if (Number(varVal) !== NaN) {
                varibles[varName] = Number(varVal);
                continue;
            }

            if (varVal.startsWith('"') && varVal.endsWith('"')) {
                varibles[varName] = varVal;
                continue;
            }

            varibles[varName] = varibles[varVal];
        } else if (currentLine.startsWith("ysws")) {
            const funcName = currentLine.substring(4, currentLine.indexOf("(")).trim();
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
        } else if (currentLine.startsWith("proposal")) {
            const code = currentLine.substring(10, currentLine.indexOf(","));
            const catchCode = currentLine.substring(currentLine.indexOf(",") + 1, currentLine.length - 1);

            try {
                // run the code
            } catch (e) {
                // run the catchCode
            }
        }
    }
}