import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deployContract, initializeZkSyncWalletAndDeployer } from "./deploy-utils/helper";
import {UFIBuyerZkSync} from "../typechain-types";
import hre, {network} from "hardhat";
import {ethers} from "hardhat";
import {getDefaultProvider, providers} from "ethers";
import {Wallet} from "ethers";

export default async function main (hre: HardhatRuntimeEnvironment) {
    const privateKey = process.env.PRIVATE_KEY

    if(network.zksync) {
        initializeZkSyncWalletAndDeployer(hre);
        const contract: UFIBuyerZkSync = <UFIBuyerZkSync>await deployContract('UFIBuyerZkSync', 'UFIBuyerZkSync', []);
        await contract.initialize();
        await contract.setRuleId(776);
        return;
    }

    const UFIBuyerMumbaiFactory = await ethers.getContractFactory("UFIBuyerMumbai");
    const UFIBuyerMumbai = await UFIBuyerMumbaiFactory.deploy();

    let owner = new Wallet(privateKey, getDefaultProvider());

    await UFIBuyerMumbai.connect(owner).initialize();
    await UFIBuyerMumbai.connect(owner).setRuleId(776);

    console.log(
        `UFIBuyerMumbai deployed to ${UFIBuyerMumbai.address}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
 main(hre);