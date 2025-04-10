// global.d.ts
import { IStaticMethods } from "flyonui/flyonui.js";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

export { };