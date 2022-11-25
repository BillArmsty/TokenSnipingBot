import { ethers } from "ethers";
import { signer } from "../common/common";
import { provider } from "../common/common";
import { config } from "../config";
import { overloads } from "../utils/interfaces";

let abi = [
  "function approve(address _spender, uint256 _value) public returns (bool success)",
];

let account = signer.connect(provider);

let MAX_INT =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

//approve token for transfer
export const approve = async (token: string, overloads: overloads) => {
  try {
    const contract = new ethers.Contract(token, abi, account);
    const tx = await contract.approve(
      config.UNISWAP_ROUTER,
      MAX_INT,
      overloads
    );
    // console.log("*****Approve*****", tx);
    console.log("Approve tx", tx.hash);
    return { success: true, data: `${tx.hash}` };
  } catch (error) {
    console.log("error approving token", error);
    return { success: false, data: `error approving token ${error}` };
  }
};
