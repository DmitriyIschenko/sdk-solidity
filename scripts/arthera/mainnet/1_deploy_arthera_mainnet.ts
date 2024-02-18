// params for verifier
import {BigNumber, utils} from "ethers";
import hre from "hardhat";
import ethers from "ethers";


//DEPLOYER
const deployer = new hre.ethers.Wallet(process.env.PRIVATE_KEY as string, hre.ethers.provider);

const PARAM_DEFAULT_AML_GRACETIME_KEY = 3;
const DEFAULT_GRACETIME_VALUE = 300;

const DEFAULT_AML_RULE = 431050;
const DEFAULT_KYC_RULE = 777;
const DEFAULT_KYCAML_RULE = 731090;
const DEFAULT_CLEANING_TOLERANCE = 3600;

const PARAM_TYPE1_DEFAULT_AML_RULE = 4;
const PARAM_TYPE1_DEFAULT_KYC_RULE = 5;
const PARAM_TYPE1_DEFAULT_KYCAML_RULE = 6;
const PARAM_CLEANING_TOLERANCE = 10;

const decimals = BigNumber.from(10).pow(18);

// issuer_registry params

const VALID_ISSUER_ADDRESS = "0xee5FF7E46FB99BdAd874c6aDb4154aaE3C90E698";
const PROOF = utils.keccak256(utils.toUtf8Bytes("PureFi Issuer"));
//const ADMIN = "0xcE14bda2d2BceC5247C97B65DBE6e6E570c4Bb6D";  // admin of issuer_registry
const ADMIN = deployer.address;  // admin of issuer_registry


// SUBSCRIPTION_SERVICE params
const TOKEN_BUYER = "";
const PROFIT_COLLECTION_ADDRESS = deployer.address;


async function main() {

    if (hre.network.name === "hardhat") {
        const receipt = await (await hre.ethers.getSigners())[0].sendTransaction({
            to: deployer.address,
            value: 60n * 10n ** 18n
        });

        await (receipt).wait();
    }

    if(hre.network.name !== "hardhat" && hre.network.name !== "arthera_mainnet"){
        throw Error("This script only for Arthera mainnet");
    }


    if (PROOF.length == 0 || ADMIN.length == 0) {
        throw new Error('ADMIN or PROOF variable is missed');
    }

    console.log(`Deployer: ${deployer.address}`);

    const PUREFI_TOKEN_FACTORY = await hre.ethers.getContractFactory("PureFiToken");

    const PPROXY = await hre.ethers.getContractFactory("PPRoxy");
    const PPROXY_ADMIN = await hre.ethers.getContractFactory("PProxyAdmin");

    const WHITELIST = await hre.ethers.getContractFactory("PureFiWhitelist");
    const ISSUER_REGISTRY = await hre.ethers.getContractFactory("PureFiIssuerRegistry");
    const VERIFIER = await hre.ethers.getContractFactory("PureFiVerifier");
    const SUBSCRIPTION_SERVICE = await hre.ethers.getContractFactory("PureFiSubscriptionService");
    const TOKEN_BUYER = await hre.ethers.getContractFactory("PureFiTokenBuyerPolygon");


    const PureFiToken = await (await PUREFI_TOKEN_FACTORY.connect(deployer).deploy("PureFi Token", "UFI")).deployed();

    // DEPLOY PROXY_ADMIN //
    // ------------------------------------------------------------------- //
    const ProxyAdmin = (await PPROXY_ADMIN.connect(deployer).deploy());
    await ProxyAdmin.deployed();

    console.log("ProxyAdmin deployed to:", ProxyAdmin.address);


    // DEPLOY ISSUER_REGISTRY //
    // ------------------------------------------------------------------- //
    const issuer_registry_mastercopy = await ISSUER_REGISTRY.connect(deployer).deploy();
    await issuer_registry_mastercopy.deployed();

    console.log("ISSUER_REGISTRY_MASTERCOPY address : ", issuer_registry_mastercopy.address);

    const issuer_registry_proxy = await PPROXY.connect(deployer).deploy(issuer_registry_mastercopy.address, ProxyAdmin.address, "0x");
    await issuer_registry_proxy.deployed();

    console.log("issuer_registry address : ", issuer_registry_proxy.address);

    // initialize issuer_registry
    const issuer_registry = await hre.ethers.getContractAt("PureFiIssuerRegistry", issuer_registry_proxy.address);

    await (await issuer_registry.connect(deployer).initialize(ADMIN)).wait();

    // set issuer
    await (await issuer_registry.connect(deployer).register(VALID_ISSUER_ADDRESS, PROOF)).wait();


    // DEPLOY WHITELIST //
    // ------------------------------------------------------------------- //

    const whitelist_mastercopy = await WHITELIST.connect(deployer).deploy();
    await whitelist_mastercopy.deployed();

    console.log("whitelist_mastercopy address : ", whitelist_mastercopy.address);

    const whitelist_proxy = await PPROXY.connect(deployer).deploy(whitelist_mastercopy.address, ProxyAdmin.address, "0x");
    await whitelist_proxy.deployed();

    console.log("whitelist_proxy address : ", whitelist_proxy.address);

    const whitelist = await hre.ethers.getContractAt("PureFiWhitelist", whitelist_proxy.address);

    // initialize whitelist
    await (await whitelist.connect(deployer).initialize(issuer_registry.address)).wait();

    // DEPLOY VERIFIER //
    // ------------------------------------------------------------------- //

    console.log("Deploying verifier...");
    const verifier_mastercopy = await VERIFIER.connect(deployer).deploy();
    await verifier_mastercopy.deployed();

    console.log("verifier_mastercopy address : ", verifier_mastercopy.address);

    const verifier_proxy = await PPROXY.connect(deployer).deploy(verifier_mastercopy.address, ProxyAdmin.address, "0x");
    await verifier_proxy.deployed();

    console.log("verifier_proxy address : ", verifier_proxy.address);

    // initialize verifier
    const verifier = await hre.ethers.getContractAt("PureFiVerifier", verifier_proxy.address);
    await (await verifier.connect(deployer).initialize(issuer_registry.address, whitelist.address)).wait();

    // set verifier params

    await (await verifier.connect(deployer).setUint256(PARAM_DEFAULT_AML_GRACETIME_KEY, DEFAULT_GRACETIME_VALUE)).wait();
    await (await verifier.connect(deployer).setUint256(PARAM_TYPE1_DEFAULT_AML_RULE, DEFAULT_AML_RULE)).wait();
    await (await verifier.connect(deployer).setUint256(PARAM_TYPE1_DEFAULT_KYC_RULE, DEFAULT_KYC_RULE)).wait();
    await (await verifier.connect(deployer).setUint256(PARAM_TYPE1_DEFAULT_KYCAML_RULE, DEFAULT_KYCAML_RULE)).wait();
    await (await verifier.connect(deployer).setUint256(PARAM_CLEANING_TOLERANCE, DEFAULT_CLEANING_TOLERANCE)).wait();

    await (await verifier.connect(deployer).setString(1, "PureFiVerifier: Issuer signature invalid")).wait();
    await (await verifier.connect(deployer).setString(2, "PureFiVerifier: Funds sender doesn't match verified wallet")).wait();
    await (await verifier.connect(deployer).setString(3, "PureFiVerifier: Verification data expired")).wait();
    await (await verifier.connect(deployer).setString(4, "PureFiVerifier: Rule verification failed")).wait();
    await (await verifier.connect(deployer).setString(5, "PureFiVerifier: Credentials time mismatch")).wait();
    await (await verifier.connect(deployer).setString(6, "PureFiVerifier: Data package invalid")).wait();

    // DEPLOY TOKEN_BUYER //
    // ------------------------------------------------------------------- //

    const token_buyer = await TOKEN_BUYER.connect(deployer).deploy();
    await token_buyer.deployed();
    console.log("Token_buyer address :", token_buyer.address);

    // DEPLOY SUBSCRIPTION_SERVICE //
    // ------------------------------------------------------------------- //

    const sub_service_mastercopy = await SUBSCRIPTION_SERVICE.connect(deployer).deploy();

    console.log("Subscription master copy : ", sub_service_mastercopy.address);

    const sub_service_proxy = await PPROXY.connect(deployer).deploy(sub_service_mastercopy.address, ProxyAdmin.address, "0x");
    await sub_service_proxy.deployed();

    console.log("Subscription service address : ", sub_service_proxy.address);

    // initialize sub_service
    const sub_service = await hre.ethers.getContractAt("PureFiSubscriptionService", sub_service_proxy.address);
    await (await sub_service.connect(deployer).initialize(
        ADMIN,
        PureFiToken.address,
        token_buyer.address,
        PROFIT_COLLECTION_ADDRESS
    )).wait();

    let yearTS = 86400 * 365;
    let USDdecimals = decimals;//10^18 // for current contract implementation
    await (await sub_service.connect(deployer).setTierData(1, yearTS, BigNumber.from(50).mul(USDdecimals), 20, 1, 5)).wait();
    await (await sub_service.connect(deployer).setTierData(2, yearTS, BigNumber.from(100).mul(USDdecimals), 20, 1, 15)).wait();
    await (await sub_service.connect(deployer).setTierData(3, yearTS, BigNumber.from(300).mul(USDdecimals), 20, 1, 45)).wait();
    await (await sub_service.connect(deployer).setTierData(10, yearTS, BigNumber.from(10000).mul(USDdecimals), 0, 3000, 10000)).wait();


    // pause profitDistribution functionality

    await (await sub_service.connect(deployer).pauseProfitDistribution()).wait();

    console.log("isProfitDistibutionPaused : ", await sub_service.isProfitDistributionPaused());

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
