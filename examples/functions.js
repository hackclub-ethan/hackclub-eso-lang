import { runEsoLang } from "../run.js";

const code = `ysws add(num1, num2) {
    propose sum = num1 + num2
    grant sum
}
sendMessage(add(5, 2))`;

runEsoLang(code);