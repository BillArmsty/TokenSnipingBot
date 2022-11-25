import { providers, ethers, utils } from "ethers";
import { config, walletAddress } from "../config";
import { UNISWAP_ABI } from "../constants";
import { overloads } from "../utils/interfaces";
import { TOKENS_TO_MONITOR } from "../constants/tokens";
import { swapExactETHForTokens } from "../types";
import { ethContract, provider } from "../common/common";
import { isHoneypot } from "./honeypot";
import { approve } from "./approve";
import { buyToken } from "./buy";

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
    const value = ethers.utils.parseUnits(
      config.ETH_BUY_AMOUNT.toString(),
      "ether"
    );

    if (receipt.maxFeePerGas && receipt.maxPriorityFeePerGas) {
      maxFeePerGas = parseInt(receipt.maxFeePerGas._hex!, 16);
      maxPriorityFeePerGas = parseInt(receipt.maxPriorityFeePerGas._hex!, 16);
    }

    let current_nonce = provider.getTransactionCount(
      process.env.WALLET_ADDRESS!
    );

    if (isNaN(maxFeePerGas!)) {
      overloads = {
        //   gasPrice,
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
        let path = [config.WETH_ADDRESS, token];
        if (path) {
          //Buy the token

          let amountOut = ethers.utils.parseEther("0");
          let deadline = Math.floor(Date.now() / 1000) + 60 * 2;
          const buy_tx = await ethContract.swapExactETHForTokens(
            amountOut,
            path,
            walletAddress,
            deadline,
            overloads
          );
        }
      } else {
        console.log("Its a rug");
      }
    } else if (methodName === "addLiquidityETH") {
      console.log("method name", methodName);
      let token = decodedData.args.token.toLowerCase();

      if (token) {
        let buyPath = [config.WETH_ADDRESS, token];

        if (buyPath) {
          const buyTxData = await buyToken(buyPath, overloads);
          console.log("Successs our buyTxData is=:", buyTxData);
          if (buyTxData.success === true) {
            await approve(token, overloads);
          }
        }
      }
    }
  };
}

export const mempool = new Mempool();
