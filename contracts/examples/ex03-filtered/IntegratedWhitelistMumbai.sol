pragma solidity ^0.8.0;

import "../../PureFiVerifier.sol";
import "../../PureFiContext.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";


contract IntegratedWhitelistMumbai is PureFiContext, AccessControlEnumerableUpgradeable {
    bytes32 public WHITELIST_ROLE;

    function initialize() public initializer {
        address verifier = 0x6ae5e97F3954F64606A898166a294B3d54830979;
        WHITELIST_ROLE = keccak256("WHITELIST_ROLE");
        __PureFiContext_init_unchained(verifier);
        __AccessControl_init_unchained();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function version() public pure returns (uint32){
        // 000.000.000 - Major.minor.internal
        return 1000001;
    }

    function setVerifier(address _verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        pureFiVerifier = _verifier;
    }

    function whitelistForWithKYCPurefi2(address _to,
        bytes calldata _purefidata
    ) external payable
    withDefaultAddressVerification(DefaultRule.KYC, _msgSender(), _purefidata)
    {
        _grantRole(WHITELIST_ROLE, _msgSender());
    }

}
