import { runEsoLang } from "./run.js";

const program = `propose a = 5+5
propose b = a * 2
sendMessage(b)`

runEsoLang(program)