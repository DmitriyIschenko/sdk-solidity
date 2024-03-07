pragma solidity ^0.8.0;

import "../uniswap/RouterInterface.sol";
import "../uniswap/interfaces/IUniswapV2Pair.sol";
import "../../openzeppelin-contracts-master/contracts/access/Ownable.sol";
import "./ITokenBuyer.sol";
import "../../openzeppelin-contracts-master/contracts/utils/introspection/ERC165.sol";
import {ReentrancyGuard} from "../../openzeppelin-contracts-master/contracts/security/ReentrancyGuard.sol";
import {ERC20PresetMinterPauser} from "../../openzeppelin-contracts-master/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";


interface ISubscriptionOwner {
    function getSubscriptionOwner() external view returns (address);
}


contract PureFiTokenBuyerArthera is Ownable, ITokenBuyer, ERC165, ReentrancyGuard {

    uint256 public constant DENOMINATOR = 1e18;
    uint256 public price;

    address public subscriptionOwner;
    address public token;

    error ForbiddenOperation();
    error NotEnoughValue();

    event TokenPurchase(address indexed recipient, uint256 ethIn, uint256 ufiOut);


    constructor(address _token) {
        price = 30_000_000_000_000;
        token = _token;
        subscriptionOwner = _msgSender();
    }


    receive() external payable {
        revert ForbiddenOperation();
    }

    fallback() external payable {
        revert ForbiddenOperation();
    }


    function setSubscriptionOwner(address newOwner) external onlyOwner {
        subscriptionOwner = newOwner;
    }

    function getSubscriptionOwner() external view returns (address) {
        // the owner of the subscription must be an EOA
        // Replace this with the account created in Step 1
        return subscriptionOwner;
    }


    function supportsInterface(bytes4 interfaceId) public view override(ERC165) returns (bool) {
        return interfaceId == type(ISubscriptionOwner).interfaceId || super.supportsInterface(interfaceId);
    }


    function buyToken(
        address _token,
        address _to
    ) external payable override nonReentrant returns (uint256) {
        if (_token == token) {
            uint256 amount = DENOMINATOR * msg.value / price;
            ERC20PresetMinterPauser(token).mint(_to, amount);

            emit TokenPurchase(_to, msg.value, amount);

            return amount;
        } else {
            revert("unknown token");
        }
    }

    // USDC used insted of busd
    function busdToUFI(
        uint256 _amountUSD
    ) external view override returns (uint256, uint256) {
        return (1, DENOMINATOR * _amountUSD / price);
    }

    function buyExactTokens(
        uint256 _amountToken,
        address _to
    ) external payable override nonReentrant {
        if ((DENOMINATOR * msg.value / price) < _amountToken) {
            revert NotEnoughValue();
        }
        uint256 amount = DENOMINATOR * msg.value / price;
        ERC20PresetMinterPauser(token).mint(_to, amount);

        emit TokenPurchase(_to, msg.value, amount);
    }
}