// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../../openzeppelin-contracts-master/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

interface ISubscriptionOwner {
    function getSubscriptionOwner() external view returns (address);
}

contract PureFiToken is ERC20PresetMinterPauser, ISubscriptionOwner {

    address public subscriptionOwner;

    constructor(string memory name, string memory symbol) ERC20PresetMinterPauser(name, symbol) {
        subscriptionOwner = _msgSender();
    }

    function setSubscriptionOwner(address newOwner) external onlyRole(DEFAULT_ADMIN_ROLE){
        subscriptionOwner = newOwner;
    }

    function getSubscriptionOwner() external view returns (address) {
        // the owner of the subscription must be an EOA
        // Replace this with the account created in Step 1
        return subscriptionOwner;
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(ISubscriptionOwner).interfaceId || super.supportsInterface(interfaceId);
    }
}
