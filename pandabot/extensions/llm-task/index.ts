import type { PandaPluginApi } from "../../src/plugins/types.js";

import { createLlmTaskTool } from "./src/llm-task-tool.js";

export default function register(api: PandaPluginApi) {
  api.registerTool(createLlmTaskTool(api), { optional: true });
}
