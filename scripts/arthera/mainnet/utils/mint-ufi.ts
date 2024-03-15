import {PureFiSubscriptionService__factory, PureFiToken__factory} from "../../../../typechain-types";
import hre from "hardhat";

const SUBSCRIPTION_SERVICE = "0x2754A2259402E207dEc79Cba6808C340B623DaB3";
const UFI_TESTNET = "0x15A32eED6FF711e28B5B38e480B0B3828E629457";
const deployer = new hre.ethers.Wallet(process.env.PRIVATE_KEY as string, hre.ethers.provider);
const AMOUNT = 4000000n * 10n ** 25n;

async function mintUfi() {
    const UfiToken = PureFiToken__factory.connect(UFI_TESTNET, hre.ethers.provider);

    await (await UfiToken.connect(deployer).mint(deployer.address, AMOUNT)).wait(1);

    console.log(`minted ${AMOUNT} to ${deployer.address}`);

    await (await UfiToken.connect(deployer).approve(SUBSCRIPTION_SERVICE, AMOUNT)).wait(1);

}

async function buySubscription() {
    const UfiToken = PureFiToken__factory.connect(UFI_TESTNET, hre.ethers.provider);
    const SubscriptionService = PureFiSubscriptionService__factory.connect(SUBSCRIPTION_SERVICE, hre.ethers.provider);

    await (await SubscriptionService.connect(deployer).subscribe(5)).wait(1);
}

async function main() {
    await mintUfi();
}


main().catch(error => {
    console.log(error);

    process.exitCode = 1;
})