pragma solidity ^0.8.0;

import "../../PureFiVerifier.sol";
import "../../PureFiContext.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract UFIWhitelistMumbai is PureFiContext, AccessControlUpgradeable {
    IERC20Upgradeable public ufi;
    bytes32 public constant WHITELIST_ROLE = keccak256("WHITELIST_ROLE");

    function initialize() external initializer {
        address verifier = 0x6ae5e97F3954F64606A898166a294B3d54830979;
        __AccessControl_init();
        grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        __PureFiContext_init_unchained(verifier);
    }

    function version() public pure returns (uint32){
        // 000.000.000 - Major.minor.internal
        return 1000000;
    }

    function setVerifier(address _verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        pureFiVerifier = _verifier;
    }

    function whitelistForWithKYCPurefi2(
        bytes calldata _purefidata
    ) external withDefaultAddressVerification(DefaultRule.KYC, _msgSender(), _purefidata) {
        grantRole(WHITELIST_ROLE, _msgSender());
    }
}
