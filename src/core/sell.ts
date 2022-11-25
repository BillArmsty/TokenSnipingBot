import { overloads } from "../utils/interfaces";
import { toHex, ethContract } from "../common/common";
import { config, walletAddress } from "../config";



export const swapExactTokensForETHSupportingFeeOnTransferTokens = async (
    amountIn: number,
    amountOutMin: number,
    path: Array<string>,
    overloads: overloads
  ) => {
    try {
      console.log("swapExactTokensForETHSupportingFeeOnTransferTokens");
      delete overloads.value;
  
      let value: any = toHex(amountIn);
      overloads["value"] = value;
  
      const deadline = Math.floor(Date.now() / 1000) + 60 * 2;
  
      console.log(
        `deadline: ${deadline}, value: ${value}, path: ${path}, overloads: ${overloads}, amountOutMin: ${amountOutMin}`
      );
  
      //sell transaction
      const tx =
        await ethContract.swapExactTokensForETHSupportingFeeOnTransferTokens(
          toHex(amountIn),
          toHex(amountOutMin),
          path,
          walletAddress,
          deadline,
          { gasLimit: 1000000 }
        );

    
  }catch (error) {
    console.log("swapExactTokensForETHSupportingFeeOnTransferTokens", error);
    return {
      success: false,
      data: `swapExactTokensForETHSupportingFeeOnTransferTokens ${error}`,
    };
  }
}
