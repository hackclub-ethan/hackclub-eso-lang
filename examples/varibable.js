import { runEsoLang } from "./run.js";

const code = `propose a = "Hello, World!
sendMessage(a)`;

runEsoLang(code);