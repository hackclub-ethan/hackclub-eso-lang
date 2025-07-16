import { runEsoLang } from "./run.js";

const program = `sendMessage("Hello World")
ysws add(num1, num2) {
    propose sum = num1 + num2
    sendMessage(sum)
    return sum
}
sendMessage(add(5,2))`;

runEsoLang(program);