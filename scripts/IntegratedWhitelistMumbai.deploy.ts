import {ethers} from "hardhat";
import {Wallet} from "ethers";
import {IntegratedWhitelistMumbai, PPRoxy, PProxyAdmin} from "../typechain-types";

const privateKey = process.env.PRIVATE_KEY as string;
const deployer = new Wallet(privateKey, ethers.provider);

async function deploy() {
    const IntegratedWhitelistMumbaiFactory = await ethers.getContractFactory("IntegratedWhitelistMumbai");
    const ProxyAdminFactory = await ethers.getContractFactory("PProxyAdmin");
    const ProxyFactory = await ethers.getContractFactory("PPRoxy");

    const IntegratedWhitelistMumbaiImplementation = <IntegratedWhitelistMumbai>await IntegratedWhitelistMumbaiFactory.connect(deployer).deploy();
    await IntegratedWhitelistMumbaiImplementation.deployed();

    const IntegratedWhitelistMumbaiProxyAdmin = <PProxyAdmin>await ProxyAdminFactory.connect(deployer).deploy();
    await IntegratedWhitelistMumbaiProxyAdmin.deployed();

    const IntegratedWhitelistMumbaiProxy = <PPRoxy>await ProxyFactory.connect(deployer).deploy(IntegratedWhitelistMumbaiImplementation.address, IntegratedWhitelistMumbaiProxyAdmin.address, "0x");
    await IntegratedWhitelistMumbaiProxy.deployed();

    const ProxyWithABI = IntegratedWhitelistMumbaiImplementation.attach(IntegratedWhitelistMumbaiProxy.address);

    const receipt = await ProxyWithABI.connect(deployer).initialize();
    await receipt.wait();

    console.log(`IntegratedWhitelistMumbai deployed to ${IntegratedWhitelistMumbaiProxy.address}`);
    console.log(`IntegratedWhitelistMumbaiProxyAdmin deployed to ${IntegratedWhitelistMumbaiProxyAdmin.address}`);
    console.log(`IntegratedWhitelistMumbaiImplementation deployed to ${IntegratedWhitelistMumbaiImplementation.address}`);
}

async function upgrade(proxyAddress: string, proxyAdminAddress: string) {
    console.log(deployer.address);
    const IntegratedWhitelistMumbaiFactory = await ethers.getContractFactory("IntegratedWhitelistMumbai");
    const newImplenetation = await IntegratedWhitelistMumbaiFactory.connect(deployer).deploy();
    await newImplenetation.deployed();
    console.log("Implementation deployed to", newImplenetation.address);

    const proxyAdmin = (await ethers.getContractFactory("PProxyAdmin")).attach(proxyAdminAddress);
    const upgradeTransaction = await proxyAdmin.connect(deployer).upgrade(proxyAddress, newImplenetation.address);
    await upgradeTransaction.wait();
    console.log("success");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy()

async function initialize(proxyAddress: string) {
    const ContractInstance = (await ethers.getContractFactory("IntegratedWhitelistMumbai")).attach(proxyAddress);
    await ContractInstance.connect(deployer).initialize().then(() => {
        console.log("SUCCESS");
    });
}
