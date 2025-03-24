import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 创建一个简单的 MCP 服务器
const server = new McpServer({
	name: "锦恢的简单 MCP 服务器",
	version: "11.45.14"
});


// 增加一个自定义工具，简单做一个加法
server.tool("add",
	{
		a: z.number(),
		b: z.number()
	},
	async ({ a, b }) => ({
		content: [{ type: "text", text: String(a + b) }]
	})
);

// 增加一个自定义的资源访问协议，叫做 kirigaya
server.resource(
	"kirigaya",
	new ResourceTemplate("kirigaya://{name}", { list: undefined }),
	async (uri, { name }) => ({
		contents: [{
			uri: uri.href,
			text: `Hello, ${name}!`
		}]
	})
);


// 以标准输入输出为通道启动
const transport = new StdioServerTransport();
server.connect(transport);