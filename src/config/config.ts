

if (!process.env.WSS_URL && !process.env.PRIVATE_KEY) {
  throw new Error("WSS_URL && PRIVATE_KEY must be in your .env file!");
  
}

export const config = {
  /**
   * Providers
   */
  ETH_BUY_AMOUNT: 0.00001,
  default_gas_limit:400000,
  WSS_URL: process.env.WSS_URL!,
  UNISWAP_ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D".toLowerCase(),
  PRIVATE_KEY: process.env.PRIVATE_KEY!,
  WETH_ADDRESS: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
};

export const walletAddress = process.env.WALLET_ADDRESS;





