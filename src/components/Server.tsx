import OpenAI from "openai";
import axios from "axios";
import { ChatCompletionTool } from "openai/resources/index.mjs";
import { Stream } from "openai/streaming.mjs";

interface CoinData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  quote: {
    USD: { market_cap: number; market_cap_dominance: number; price: number };
  };
}

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // makes public the API_KEY, but it's no problem for the gaianode used.
});

async function listCryptoAssets() {
  try {
    const response = await axios.get(
      "/api/proxy?endpoint=v1/cryptocurrency/listings/latest"
    );

    const coins = response.data.data.map((coin: CoinData) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      slug: coin.slug,
      price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      market_cap_dominance: coin.quote.USD.market_cap_dominance,
    }));
    console.log(response.data.data);
    return { result: "ok", coins };
  } catch (error: unknown) {
    return { result: "error", message: error.message };
  }
}

async function getHighestMarketCap() {
  try {
    const response = await axios.get(
      "/api/proxy?endpoint=v1/cryptocurrency/listings/latest"
    );
    const coins = response.data.data.map((coin: CoinData) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      slug: coin.slug,
      price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      market_cap_dominance: coin.quote.USD.market_cap_dominance,
    }));
    const sortedCoins = coins.sort((a, b) => b.market_cap - a.market_cap);
    console.log(sortedCoins);
    return { result: "ok", coins: sortedCoins };
  } catch (error: unknown) {
    return { result: "error", message: error.message };
  }
}

async function getHighestPrice() {
  try {
    const response = await axios.get(
      "/api/proxy?endpoint=v1/cryptocurrency/map"
    );
    const coins = response.data.data.map((coin: CoinData) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      slug: coin.slug,
      price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      market_cap_dominance: coin.quote.USD.market_cap_dominance,
    }));
    const sortedCoins = coins.sort((a, b) => b.price - a.price);
    console.log(sortedCoins);
    return { result: "ok", coins: sortedCoins };
  } catch (error: unknown) {
    return { result: "error", message: error.message };
  }
}

async function getCryptoById(id: number) {
  try {
    const response = await axios.get(
      "/api/proxy?endpoint=v2/cryptocurrency/quotes/latest?id=" + id
    );
    const coins = response.data.data[id].map((coin: CoinData) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      slug: coin.slug,
      price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      market_cap_dominance: coin.quote.USD.market_cap_dominance,
    }));
    console.log(coins);
    return { result: "ok", coins };
  } catch (error: unknown) {
    return { result: "error", message: error.message };
  }
}

async function getCryptoBySlug(slug: string) {
  try {
    const response = await axios.get(
      "/api/proxy?endpoint=v2/cryptocurrency/quotes/latest?slug=" + slug
    );
    const coins = response.data.data[slug].map((coin: CoinData) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      slug: coin.slug,
      price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      market_cap_dominance: coin.quote.USD.market_cap_dominance,
    }));
    console.log(coins);
    return { result: "ok", coins };
  } catch (error: unknown) {
    return { result: "error", message: error.message };
  }
}

async function getCryptoBySymbol(symbol: string) {
  try {
    const response = await axios.get(
      "/api/proxy?endpoint=v2/cryptocurrency/quotes/latest?symbol=" + symbol
    );
    const coins = response.data.data[symbol].map((coin: CoinData) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      slug: coin.slug,
      price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      market_cap_dominance: coin.quote.USD.market_cap_dominance,
    }));
    console.log(coins);
    return { result: "ok", coins };
  } catch (error: unknown) {
    return { result: "error", message: error.message };
  }
}

//tools = [
//  {
//      "type": "function",
//      "function": {
//          "name": "get_weather",
//          "parameters": {
//              "type": "object",
//              "properties": {
//                  "location": {"type": "string"},
//                  "unit": {"type": "string", "enum": ["c", "f"]},
//              },
//              "required": ["location", "unit"],
//              "additionalProperties": False,
//          },
//      },
//  }
//]

const Tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "listCryptoAssets",
      description:
        "list available crypto assets from coinmarket and fetch id, name, symbol, slug, price, market cap, market cap dominance",
      //parameters: {},
    },
  },
  {
    type: "function",
    function: {
      name: "getHighestMarketCap",
      description:
        "get the highest market cap crypto assets from coinmarket and fetch id, name, symbol, slug, price, market cap, market cap dominance",
      //parameters: {},
    },
  },
  {
    type: "function",
    function: {
      name: "getHighestPrice",
      description:
        "get the highest price crypto assets from coinmarket and fetch id, name, symbol, slug, price, market cap, market cap dominance",
    },
  },
  {
    type: "function",
    function: {
      name: "getCryptoById",
      description:
        "get data of a crypto asset with the specified id from coinmarket, including id, name, symbol, slug, price, market cap, market cap dominance.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getCryptoBySlug",
      description:
        "get data of a crypto asset with the specified slug from coinmarket, including id, name, symbol, slug, price, market cap, market cap dominance.",
      parameters: {
        type: "object",
        properties: {
          slug: { type: "string" },
        },
        required: ["slug"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getCryptoBySymbol",
      description:
        "get data of a crypto asset with the specified symbol from coinmarket, including id, name, symbol, slug, price, market cap, market cap dominance.",
      parameters: {
        type: "object",
        properties: {
          symbol: { type: "string" },
        },
        required: ["symbol"],
        additionalProperties: false,
      },
    },
  },
];

interface ToolCall {
  function: {
    name: string;
    arguments?: string;
  };
  id: string;
}

async function evalTools(tools: ToolCall[]) {
  const result: [unknown, string][] = [];
  for (const tool of tools) {
    console.log(tool.function.arguments);
    if (tool.function.name === "listCryptoAssets") {
      result.push([await listCryptoAssets(), tool.id]);
    } else if (tool.function.name === "getHighestMarketCap") {
      result.push([await getHighestMarketCap(), tool.id]);
    } else if (tool.function.name === "getHighestPrice") {
      result.push([await getHighestPrice(), tool.id]);
    } else if (tool.function.name === "getCriptoById") {
      if (tool.function.arguments) {
        const args = JSON.parse(tool.function.arguments);
        result.push([await getCryptoById(args.id), tool.id]);
      }
    } else if (tool.function.name === "getCryptoBySlug") {
      if (tool.function.arguments) {
        const args = JSON.parse(tool.function.arguments);
        result.push([await getCryptoBySlug(args.slug), tool.id]);
      }
    } else if (tool.function.name === "getCryptoBySymbol") {
      if (tool.function.arguments) {
        const args = JSON.parse(tool.function.arguments);
        result.push([await getCryptoBySymbol(args.symbol), tool.id]);
      }
    } else {
      result.push([
        {
          result: "error",
          message: `Unknown function '${tool.function.name}'`,
        },
        tool.id,
      ]);
    }
  }
  return result;
}

async function handlerLlmResponse(
  messages: OpenAI.ChatCompletionMessageParam[],
  stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk> & {
    _request_id?: string | null;
  }
) {
  let tools: OpenAI.Chat.Completions.ChatCompletionChunk.Choice.Delta.ToolCall[] =
    [];
  let content = "";

  for await (const chunk of stream) {
    if (chunk.choices.length == 0) {
      break;
    }
    const delta = chunk.choices[0].delta;
    content += delta.content;

    if (delta.tool_calls) {
      if (tools.length === 0) {
        tools = delta.tool_calls;
      } else {
        delta.tool_calls.forEach((tool_call, index) => {
          if (!tools[index]) {
            tools[index] = tool_call;
          } else if (tool_call.function?.arguments && tools[index].function) {
            const currentArgs = tools[index].function.arguments || "";
            tools[index].function.arguments =
              currentArgs + tool_call.function.arguments;
          }
        });
      }
    }
  }
  if (tools.length == 0) {
    messages.push({ role: "assistant", content: content });
  } else {
    messages.push({
      role: "assistant",
      content: content,
      tool_calls: tools.map(
        (tool) => tool as OpenAI.ChatCompletionMessageToolCall
      ),
    });
  }

  return await evalTools(tools);
}

async function chatCompletion(messages: OpenAI.ChatCompletionMessageParam[]) {
  const params: OpenAI.ChatCompletionCreateParams = {
    model: process.env.OPENAI_MODEL_NAME || "gpt-4o",
    messages: messages,
    tools: Tools,
    stream: true,
  };

  const stream = await openai.chat.completions.create(params);
  const tool_result = await handlerLlmResponse(messages, stream);
  if (tool_result.length > 0) {
    for (const result of tool_result) {
      messages.push({
        role: "tool",
        content: JSON.stringify(result[0]),
        tool_call_id: result[1],
      });
    }
    return false;
  } else {
    return true;
  }
}

export async function sendMessage(
  messages: OpenAI.ChatCompletionMessageParam[],
  userInput: string
) {
  if (messages.length == 0) {
    messages.push({
      role: "system",
      content: "You are an information fetching assistant.",
    });
  }
  console.log(messages);
  messages.push({ role: "user", content: userInput });
  let finishPrompts = false;
  while (!finishPrompts) {
    finishPrompts = await chatCompletion(messages);
  }
  return messages;
}
