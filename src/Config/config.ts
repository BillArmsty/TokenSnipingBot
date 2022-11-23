import dotenv from "dotenv";
import { ethers } from "ethers";

// export const UNISWAP_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
export const WSS_URL = process.env.WSS_URL!;

// export const slippage: any = 23 / 100;
// export const MIN_PRICE_IMPACT = 0.5;

// export const fallBackGasLimit = 100000;
// export const buyAmount = 0.000001 * 10 ** 18;
// export const TOKENS_TO_MONITOR = [""]
const walletAddress = ethers.utils.getAddress(process.env.WALLET_ADDRESS!);
export const wssProvider = new ethers.providers.WebSocketProvider(WSS_URL);

export const config = {
  provider: wssProvider,
  UNISWAP_ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D".toLowerCase(),
  PRIVATE_KEY: process.env.PRIVATE_KEY!,
  WALLET_ADDRESS: walletAddress,
  TOKEN_TO_MONITOR: process.env.TOKEN_TO_MONITOR,
  WETH_ADDRESS: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  //   LIQUIDITY_METHODS: [
  //     "c9567bf9",
  //     "8a8c523c",
  //     "293230b8",
  //     "0bd05b69",
  //     "01339c21"
  //   ]
};
