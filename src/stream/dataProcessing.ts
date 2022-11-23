import { ethers } from "ethers";
import { config } from "../Config/config";
import { txContents } from "../contents/interface";
import ABI from "../utils/contract-abi.json";
const methodsExcluded = ["0x0", "0x"];
let tokensToMonitor: any = config.TOKEN_TO_MONITOR;

export const dataProcessing = async (txContents: txContents) => {
  //exclude transfer method
  if (!methodsExcluded.includes(txContents.data)) {
    //compare transaction router to unuswap router address
    let routerAddress = txContents.to?.toLocaleLowerCase();
    // console.log("fount it ", routerAddress);
    if (routerAddress === config.UNISWAP_ROUTER) {
      console.log("====Transaction to uniswap router");
      console.log("txContents:", txContents.data);

      //decode the txContents.data to get the method name
      const abiIn = new ethers.utils.Interface(ABI);
      const decodedData = abiIn.parseTransaction({ data: txContents.data });

      console.log(
        `DecodedData method name is: ${JSON.stringify(
          decodedData.name,
          null,
          "\t"
        )},`
      );
      let methodName = decodedData.name;
      console.log(methodName);
      //   let path = decodedData.args.path;
      //   let token = path[path.length - 1];

      // Filter the addLiquidity method
      if (methodName === "addLiquidity") {
        let token;
        let tokenA = decodedData.args.tokenA.toLocaleLowerCase();
        let tokenB = decodedData.args.tokenB.toLocaleLowerCase();
        console.log(`TokenA: ${tokenA}, TokenB: ${tokenB}`);

        if (tokenA === tokensToMonitor[0]) {
          token = tokenA;
        } else if (tokenB === tokensToMonitor[0]) {
          token = tokenB;
        }
        // Loops through token to monitor list
        for (let i = 0; i < tokensToMonitor.length; i++) {
          let tokenToMonitor = tokensToMonitor[i];
          console.log("TokenToMonitor", tokenToMonitor);
          /// Compare token to monitor with added Liquidity token
          if (tokenToMonitor.includes(token)) {
            console.log("Found the token ", token);
            //   let path = [config.WETH_ADDRESS, token];
            //   let to = config.WALLET_ADDRESS;
            // //   let amountIn = config.BUY_AMOUNT;
          }
        }
      }

      // add liquidity ETH methods
      if (methodName === "addLiquidityETH") {
        let token = decodedData.args.token.toLocaleLowerCase();
        for (let i = 0; i < tokensToMonitor?.length; i++) {
          let tokenToMonitor = tokensToMonitor[i].toLowerCase();
        //   console.log("TokenToMonitor:", tokenToMonitor);

          if (tokenToMonitor.includes(token)) {
            console.log("Found the token ", token);
            //   let path = [config.WETH_ADDRESS, token];
          }
        }
      }
    }
  }
};
