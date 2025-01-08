This is a simple chatbot that can fetch information from the coinmarketcap api. Leveraging a gaia node trained for tool use.

# Getting Started

The following information is required to run the app in a local environment:

- OPENAI_BASE_URL: URL of the openAI compatible API of a LLM trained with tool use (e.g. a gaianode)
- OPENAI_MODEL_NAME: Model name (e.g. llama)
- OPENAI_API_KEY: API key for the openAI compatible API (not required for a gaianode)
- COINMARKET_URL: URL for coinmarket's API
- COINMARKET_API: Coinmarket's API key

# Warning

The API key for the openAI compatible API will be public through the browser.

For the public gaia node, an API key is not required.
