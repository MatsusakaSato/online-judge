import ExampleSandbox from "./impl/example.sandbox";
import RemoteSandbox from "./impl/remote.sandbox";
import ThirdPartySandbox from "./impl/thirdparty.sandbox";
class CodeSandboxFactory {
  getInstance(type: "example" | "remote" | "thirdparty") {
    switch (type) {
      case "example":
        return new ExampleSandbox();
      case "remote":
        return new RemoteSandbox();
      case "thirdparty":
        return new ThirdPartySandbox();
      default:
        return new ExampleSandbox();
    }
  }
}
const sandbox = new CodeSandboxFactory().getInstance("example");
export default sandbox;
