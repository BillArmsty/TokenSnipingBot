import { providers, ethers, utils } from "ethers";
import { config, walletAddress } from "../config";
import { UNISWAP_ABI } from "../constants";
import { overloads } from "../utils/interfaces";
import { TOKENS_TO_MONITOR } from "../constants/tokens";
import { ethContract, provider } from "../common/common";
import { isHoneypot } from "./honeypot";
import { approve } from "./approve";
import { buyToken } from "./buy";
import { swapExactTokensForTokensSupportingFeeOnTransferTokens } from "./sell";
// import { getAmounts } from "./balance";

import { sendNotification } from "../telegram";

class Mempool {
  private wssProvider: providers.WebSocketProvider;
  private _uniSwap: utils.Interface;

  constructor() {
    this.wssProvider = new providers.WebSocketProvider(config.WSS_URL);
    this._uniSwap = new utils.Interface(UNISWAP_ABI);
  }

  monitor = async () => {
    this.wssProvider.on("pending", async (hash: string) => {
      try {
        let receipt = await this.wssProvider.getTransaction(hash);

        receipt && (await this._process(receipt));
      } catch (error) {
        console.error(error);
      }
    });
  };

  private _process = async (receipt: providers.TransactionResponse) => {
    let {
      hash: txHash,
      from: txAddressFrom,
      to: txAddressTo,
      maxPriorityFeePerGas: txGasFees,
      maxFeePerGas: txMaxGas,
      gasPrice: txGasPrice,
      data,
    } = receipt;

    let tx: utils.TransactionDescription;
    try {
      tx = this._uniSwap.parseTransaction({
        data,
      });
    } catch (error) {
      return;
    }

    let { name: txMethodName, args: txArgs } = tx;

    let abiIn = new ethers.utils.Interface(UNISWAP_ABI);
    let decodedData = abiIn.parseTransaction({ data: receipt.data });

    let methodName = decodedData.name;
    let maxFeePerGas: number | undefined;
    let maxPriorityFeePerGas: number | undefined;
    let overloads: overloads;
    let value = ethers.utils.parseUnits(
      config.ETH_BUY_AMOUNT.toString(),
      "ether"
    );

    if (receipt.maxFeePerGas && receipt.maxPriorityFeePerGas) {
      maxFeePerGas = parseInt(receipt.maxFeePerGas._hex!, 16);
      maxPriorityFeePerGas = parseInt(receipt.maxPriorityFeePerGas._hex!, 16);
    }

    let current_nonce = await provider.getTransactionCount(
      process.env.WALLET_ADDRESS!
    );

    if (isNaN(maxFeePerGas!)) {
      overloads = {
        // gasPrice,
        gasLimit: config.default_gas_limit,
        nonce: current_nonce,
        value: value,
      };
    } else {
      overloads = {
        gasLimit: config.default_gas_limit,
        nonce: current_nonce,
        maxFeePerGas,
        maxPriorityFeePerGas,
        value: value,
      };
    }

    // console.log(methodName);

    //Filter the addLiquidity method

    if (methodName === "addLiquidity") {
      console.log("method name", methodName);
      let token;
      let tokenA = decodedData.args.tokenA.toLowerCase();
      let tokenB = decodedData.args.tokenB.toLowerCase();

      console.log("Token A", tokenA);
      tx;

      //check if any tokens are in the tokenToMonitor list
      if (TOKENS_TO_MONITOR.includes(tokenA.toLowerCase())) {
        token = tokenA;
      } else if (TOKENS_TO_MONITOR.includes(tokenB.toLowerCase())) {
        token = tokenB;
      }

      let rugStatus = await isHoneypot(token);
      if (rugStatus === false) {
        console.log("Not a rug");

        if (token) {
          let buyPath = [config.WETH_ADDRESS, token];
          if (buyPath) {
            //Buy the token

            let buyTxData = await buyToken(buyPath, overloads);
            if (buyTxData.success === true) {
              await approve(token, overloads);

              const message = `Bought : https://goerli.etherscan.io/tx/${buyTxData.data}`;
              await sendNotification(message);
            }
          }
        }
      } else {
        console.log("Its a rug");
      }
    } else if (methodName === "addLiquidityETH") {
      console.log("method name", methodName);
      let token = decodedData.args.token.toLowerCase();

      let rugStatus = await isHoneypot(token);
      if (rugStatus === false) {
        console.log("Not a rug");

        if (token) {
          let buyPath = [config.WETH_ADDRESS, token];

          if (buyPath) {
            let buyTxData = await buyToken(buyPath, overloads);
            console.log("Successs our buyTxData is=:", buyTxData);

            if (buyTxData.success === true) {
              const message = `Bought : https://goerli.etherscan.io/tx/${buyTxData.data}`;
              await sendNotification(message);
              delete overloads.value;
              overloads["nonce"] += 1;

              const approveSuccess = await approve(token, overloads);

              if (approveSuccess.success === true) {
                let sellPath = [token, config.WETH_ADDRESS];

                const ethContract2 = new ethers.Contract(
                  config.WETH_ADDRESS,
                  [
                    "function balanceOf(address owner) external view returns (uint)",
                  ],
                  this.wssProvider
                );

                let amountIn = await ethContract2.balanceOf(walletAddress);
                const amountOut = ethers.utils.parseEther("0");
                let deadline = Math.floor(Date.now() / 1000) + 60 * 4;

                overloads["nonce"]! += 1;

                const sellTxData =
                  await ethContract.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                    amountIn,
                    amountOut,
                    sellPath,
                    walletAddress,
                    deadline,
                    overloads
                  );
                console.log("sell DATA", sellTxData);
              }
            }
          }
        }
      } else {
        console.log("Its a rug");
      }
    }
  };
}

export const mempool = new Mempool();
