import { BigNumber } from "ethers";
import { ethContract, toHex } from "../common/common";
import { overloads } from "../utils/interfaces";
import { walletAddress } from "../config";

export interface txContents {
  hash: string;
  from: string;
  to: string;
  maxPriorityFeePerGas?: BigNumber;
  maxFeePerGas?: BigNumber;
  gasPrice: BigNumber;
  gas: any;
  data: string;
}

export interface Overloads {
  gasLimit?: number;
  nonce?: number;
  gasPrice?: number;
  maxPriorityFeePerGas?: number;
  maxFeePerGas?: number;
  value?: number;
}

export const swapExactETHForTokens = async (
  amountOutMin: number,
  path: Array<string>,
  EthAmount: number,
  overloads: overloads
) => {
  try {
    console.log("swapExactETHForTokens");
    let value: any = toHex(EthAmount);
    overloads.value = value;

    const deadline = Math.floor(Date.now() / 1000) + 60 * 2;

    //buy transaction
    const tx = await ethContract.swapExactETHForTokens(
      toHex(amountOutMin),
      path,
      walletAddress,
      deadline,
      overloads
    );
  } catch (error) {
    console.log("Transaction Not completed", error);
    return { success: false, data: `Transaction Not completed ${error}` };
  }
};
