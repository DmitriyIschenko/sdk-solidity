import hre from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {parseEther} from "ethers/lib/utils";

describe("TokenBuyer", ()=>{
    describe("Deployment", ()=>{
       async function tokenBuyerFixture(){
           const TokenFactory = await hre.ethers.getContractFactory("PureFiToken");
           const TokenBuyerFactory = await hre.ethers.getContractFactory("PureFiTokenBuyerArthera");

           const [owner, ...otherWallet] = await hre.ethers.getSigners();

           const Token = await TokenFactory.connect(owner).deploy("PureFi", "UFI");
           await Token.deployed();




           const TokenBuyer = await TokenBuyerFactory.connect(owner).deploy(Token.address);
           await TokenBuyer.deployed();
           const MINTER_ROLE = await Token.connect(owner).MINTER_ROLE();
           await (await Token.connect(owner).grantRole(MINTER_ROLE, TokenBuyer.address)).wait(1);

           return {Token, TokenBuyer, owner, otherWallet};
       }

        it('should ', async () => {
            const {Token, TokenBuyer, owner, otherWallet} = await loadFixture(tokenBuyerFixture);

            console.log(parseEther("1"));
            await (await TokenBuyer.connect(owner).buyToken(Token.address, owner.address, {
                value: parseEther("1")
            })).wait()

            console.log(await Token.connect(owner).balanceOf(owner.address))
            console.log((await Token.connect(owner).balanceOf(owner.address)).div(10n ** 18n));

            console.log(await TokenBuyer.connect(owner).busdToUFI(1000n));
        });
    });
})