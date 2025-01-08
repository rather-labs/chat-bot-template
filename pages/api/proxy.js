import axios from 'axios';

const headers = {
    "X-CMC_PRO_API_KEY": process.env.COINMARKET_API,
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  
const COINMARKET_URL = process.env.COINMARKET_URL || "" 

export default async function handler(req, res) {
  try {
    // Extract the path segment to determine the endpoint
    const { endpoint } = req.query;
    console.log(COINMARKET_URL  + endpoint);
    const response = await axios.get(COINMARKET_URL  + endpoint, {
        headers
      });
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching data from external API' });
  }
}