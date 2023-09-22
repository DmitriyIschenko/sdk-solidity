import {ethers} from "hardhat";
import {Wallet} from "ethers";
import {PPRoxy, PProxyAdmin, UFIWhitelistMumbai} from "../typechain-types";

async function main() {
    const privateKey = process.env.PRIVATE_KEY as string;
    const deployer = new Wallet(privateKey, ethers.provider);

    const UFIWhitelistMumbaiFactory = await ethers.getContractFactory("UFIWhitelistMumbai");
    const ProxyAdminFactory = await ethers.getContractFactory("PProxyAdmin");
    const ProxyFactory = await ethers.getContractFactory("PPRoxy");

    const UFIWhitelistMumbaiImplementation = <UFIWhitelistMumbai>await UFIWhitelistMumbaiFactory.connect(deployer).deploy();
    const UFIWhitelistMumbaiProxyAdmin = <PProxyAdmin> await ProxyAdminFactory.connect(deployer).deploy();
    const UFIWhitelistMumbaiProxy = <PPRoxy> await ProxyFactory.connect(deployer).deploy(UFIWhitelistMumbaiImplementation.address,
        UFIWhitelistMumbaiProxyAdmin.address, "0x");

    const ProxyWithABI = UFIWhitelistMumbaiImplementation.attach(UFIWhitelistMumbaiProxy.address);

    await ProxyWithABI.connect(deployer).initialize();


    console.log(`UFIWhitelistMumbaiProxy deployed to ${UFIWhitelistMumbaiProxy.address}`);
    console.log(`UFIWhitelistMumbaiProxyAdmin deployed to ${UFIWhitelistMumbaiProxyAdmin.address}`);
    console.log(`UFIWhitelistMumbaiImplementation deployed to ${UFIWhitelistMumbaiImplementation.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main();