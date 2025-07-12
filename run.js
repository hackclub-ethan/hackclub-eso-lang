function runEsoLang(code) {
    const lines = code.split("\n");

    const varibles = {};

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
        }
    }
}