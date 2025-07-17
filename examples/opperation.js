import { runEsoLang } from "../run.js";

const code = `propose sum = 5 + 2
sendMessage(sum)`;

runEsoLang(code);