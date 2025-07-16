import { runEsoLang } from "../run.js";

const code = `proposal(propose true = "bool", sendMessage("The name of a var can not be a reserved word"))`;

runEsoLang(code);