import { ethers } from "ethers";
import { config } from "../config/config";
import { UNISWAP_ABI} from "../constants";


export function toHex(amount: any) {
  if (amount.toString().includes("e")) {
    let hexed_amount = amount.toString(16);
    return `0x${hexed_amount}`;
  } else {
    let parsed_amount = parseInt(amount);
    let hexed_amount = parsed_amount.toString(16);
    return `0x${hexed_amount}`;
  }
}
//signer

export const provider = new ethers.providers.WebSocketProvider(config.WSS_URL);
export const signer = new ethers.Wallet(config.PRIVATE_KEY);
const account = signer.connect(provider);


export const ethContract = new ethers.Contract(
  config.UNISWAP_ROUTER,
  UNISWAP_ABI,
  account
);







