import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-chai-matchers";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-contract-sizer";
import "hardhat-storage-layout";

require("dotenv").config()

const config: HardhatUserConfig = {
  solidity: {
    version : "0.8.19",
    settings : {
      optimizer : {
        enabled : true,
        runs : 200
      }
    }
  },
  networks: {
    hardhat: {
      // forking: {
      //   url: "https://rpc.arthera.net"
      // }
    },
    arthera_mainnet: {
       url: "https://rpc.arthera.net"
       // url: "https://rpc-test2.arthera.net"
    }


  },
  // etherscan : {
  //   apiKey : etherscanApiKey,
  // }
  

};
export default config;
