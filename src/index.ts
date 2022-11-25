import { mempool } from "./core";


const Main = async () => {
  await mempool.monitor()
};


Main();
