import { Language } from "@/constants/enum";
import sandbox from "@/core";
const result = sandbox.execute({
  language: Language.CPP,
  source_code: "",
  stdin: [""],
});
console.log(result);