import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 创建一个简单的 MCP 服务器
const server = new McpServer({
	name: "锦恢的简单 MCP 服务器",
	version: "11.45.14"
});


// 增加一个自定义工具，简单做一个加法
server.tool(
	// 定义工具的 ID
	"add",

	// 定义工具描述
	"进行两个数字的加法",

	// 定义工具的函数签名
	{
		a: z.number(),
		b: z.number()
	},

	// 定义工具如何具体执行
	async ({ a, b }) => {
		const result: CallToolResult = {
			content: [
				{
					type: "text",
					text: String(a + b)
				}
			]
		};

		return result;
	}
);

// 增加一个自定义的资源访问协议，叫做 kirigaya
server.resource(
	// 定义资源的 ID
	"kirigaya",

	// 定义资源的访问协议
	new ResourceTemplate("kirigaya://{name}", { list: undefined }),

	// 定义如何响应请求来返回资源
	async (uri, { name }) => {
		// 定义返回的响应
		const result: ReadResourceResult = {
			contents: [
				{
					uri: uri.href,
					text: `Hello, ${name}!`
				}
			]
		}

		return result;
	}
);

// 定义一个内置 prompt
server.prompt(
	"review-code",
	{
		code: z.string()
	},
	({ code }) => ({
		messages: [{
			role: "user",
			content: {
				type: "text",
				text: `Please review this code:\n\n${code}`
			}
		}]
	})
);


// 以标准输入输出为通道启动
const transport = new StdioServerTransport();
server.connect(transport);