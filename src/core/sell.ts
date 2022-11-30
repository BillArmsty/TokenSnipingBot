import { overloads } from "../utils/interfaces";
import { toHex, ethContract } from "../common/common";
import { config, walletAddress } from "../config";



export const swapExactTokensForTokensSupportingFeeOnTransferTokens = async (
  path: string[],
  overLoads: overloads,
  amountIn: any,
  amountOutMin: any
) => {
  try {
    // let amountIn = ethers.utils.parseEther("0.001");
    // let amountOutMin = ethers.utils.parseEther("0");
    let deadline = Math.floor(Date.now() / 1000) + 60 * 2;

    const tx =
      await ethContract.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amountIn,
        amountOutMin,
        path,
        walletAddress,
        deadline,
        overLoads
      );
    //overload include only nonce, gasPrice, gaslimit
    console.log("\n\n\n ************** SELL ***************\n");
    console.log(tx);

    return { success: true, data: tx.hash };
  } catch (error) {
    console.log("Error swapping exact token for ETH", error);
    return { success: false, data: error };
  }
};
