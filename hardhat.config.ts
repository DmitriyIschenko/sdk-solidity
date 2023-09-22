import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-chai-matchers";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-contract-sizer";
import "hardhat-storage-layout";

require('dotenv').config();

const Infura = {
  Mainnet: "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY,
  Ropsten: "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY,
  Rinkeby: "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY,
  Kovan: "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY,
  BSC: "https://bsc-dataseed1.binance.org ",
  Polygon: "https://polygon-mainnet.infura.io/v3/"+ process.env.INFURA_API_KEY
};
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
      forking: {
        url: Infura.Mainnet,
        blockNumber: 15646235
      }
    },
    rinkeby: {
      url: Infura.Rinkeby,
      gas: 10000000,
      gasPrice: 10000000000,
      accounts: { mnemonic : process.env.WALLET_MNEMONIC }
    },
    mainnet : {
      url : Infura.Mainnet,
      gas: "auto",
      gasPrice: "auto",
      minGasPrice: 10000000000,
      accounts : { mnemonic : process.env.WALLET_MNEMONIC }
    },
    ropsten : {
      url : Infura.Ropsten,
      gas: 5000000,
      gasPrice: 6000000000,
      accounts : { mnemonic : process.env.WALLET_MNEMONIC }
    },
    kovan : {
      url : Infura.Kovan,
      gas: 10000000,
      accounts : { mnemonic : process.env.WALLET_MNEMONIC }
    },
    bsc : {
      url : process.env.BSC_URL,
      gas: 5000000,
      gasPrice: 5000000000,
      accounts : { mnemonic : process.env.WALLET_MNEMONIC }
    },

    bsctest : {
      url : "https://data-seed-prebsc-1-s1.binance.org:8545",
      gas: 5000000,
      gasPrice: 10000000000,
      accounts : { mnemonic : process.env.WALLET_MNEMONIC }
    },
    auroratest : {
      url : "https://testnet.aurora.dev",
      accounts : { mnemonic : process.env.WALLET_MNEMONIC }
    },
    auroramainnet : {
      url : "https://mainnet.aurora.dev",
      accounts : { mnemonic : process.env.WALLET_MNEMONIC }
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: { mnemonic : process.env.WALLET_MNEMONIC }
    },
    polygon_mainnet : {
      url : Infura.Polygon,
      accounts : { mnemonic : process.env.WALLET_MNEMONIC }
    },
    bitgert_testnet: {
      url: "https://testnet-rpc.brisescan.com",
      gasPrice: 20000000000,
      accounts: {mnemonic: process.env.WALLET_MNEMONIC}
    },
    bitgert_mainnet: {
      url: "https://rpc.icecreamswap.com",
      chainId: 32520,
      gasPrice: 20000000000,
      accounts: {mnemonic: process.env.WALLET_MNEMONIC}
    }

  },
  etherscan : {
    apiKey : process.env.ETHERSCAN_API_KEY,
  }
  

};
export default config;
