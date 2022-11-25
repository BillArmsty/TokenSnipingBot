import { overloads } from "../utils/interfaces";
import { ethContract } from "../common/common";
import { ethers } from "ethers";
import { walletAddress } from "../config";




export const buyToken = async (
    path: string[],
    overLoads: overloads
  ) => {
    try {
      let amountOutMin = ethers.utils.parseEther("0");
      let deadline = Math.floor(Date.now() / 1000) + 60 * 2;
      const tx = await ethContract.swapExactETHForTokens(
        amountOutMin,
        path,
        walletAddress,
        deadline,
        overLoads
      );
      console.log("=========", tx);
      return { success: true, data: tx.hash };
    } catch (error) {
      console.log("Error swapping eaxct token for ETH", error);
      return { success: false, data: error };
    }
  };