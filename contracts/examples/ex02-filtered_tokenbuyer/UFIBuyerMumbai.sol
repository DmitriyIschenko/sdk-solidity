pragma solidity ^0.8.0;


import "../../PureFiVerifier.sol";
import "../../PureFiContext.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract UFIBuyerMumbai is PureFiContext, OwnableUpgradeable {
    IERC20Upgradeable ufi;
    uint ruleID;

    function initialize() external initializer {
        ufi = IERC20Upgradeable(0x70892902C0BfFdEEAac711ec48F14c00b0fa7E3A);
        address verifier = 0x6ae5e97F3954F64606A898166a294B3d54830979;
        __Ownable_init();
        __PureFiContext_init_unchained(verifier);
    }

     function version() public pure returns(uint32){
        // 000.000.000 - Major.minor.internal
        return 2000005;
    }

    function setVerifier(address _verifier) external onlyOwner{
        pureFiVerifier = _verifier;
    }

    function setRuleId(uint _ruleId) external onlyOwner {
        ruleID = _ruleId;
    }

    /**
    * buys UFI tokens for the full amount of _value provided.
    * @param _to - address to send bought tokens to
    * @param _purefidata -  a signed data package from the PureFi Issuer
    */
    function buyForWithAML(address _to,
                    bytes calldata _purefidata
                    ) external payable withDefaultAddressVerification (DefaultRule.AML, msg.sender, _purefidata) {
        _buy(_to);
    }

    /**
    * buys UFI tokens for the full amount of _value provided.
    * @param _to - address to send bought tokens to
    * @param _purefidata -  a signed data package from the PureFi Issuer
    */
    function buyForWithKYC(address _to,
                    bytes calldata _purefidata
                    ) external payable withDefaultAddressVerification (DefaultRule.KYC, msg.sender, _purefidata) {
        _buy(_to);
    }

    /**
    * buys UFI tokens for the full amount of _value provided.
    * @param _to - address to send bought tokens to
   @param _purefidata -  a signed data package from the PureFi Issuer
    */
    function buyForWithKYCAML(address _to,
                   bytes calldata _purefidata
                    ) external payable withDefaultAddressVerification (DefaultRule.KYCAML, msg.sender, _purefidata) {
        _buy(_to);
    }

    function buyForWithCOUNTRYKYC(address _to,
                   bytes calldata _purefidata
                    ) external payable withDefaultAddressVerification (DefaultRule.COUNTRYKYC, msg.sender, _purefidata) {
        _buy(_to);
    }

    function buyForWithAGEKYC(address _to,
                   bytes calldata _purefidata
                    ) external payable withDefaultAddressVerification (DefaultRule.AGEKYC, msg.sender, _purefidata) {
        _buy(_to);
    }

    function buyForWithCOUNTRYAGEKYC(address _to,
                   bytes calldata _purefidata
                    ) external payable withDefaultAddressVerification (DefaultRule.COUNTRYAGEKYC, msg.sender, _purefidata) {
        _buy(_to);
    }

    function buyForWithOptionalKYCAML(address _to,
                   bytes calldata _purefidata
                    ) external payable withDefaultAddressVerification (DefaultRule.Type2KYCAML, msg.sender, _purefidata) {
        _buy(_to);
    }


    function buyForWithKYCPurefi1(address _to,
        bytes calldata _purefidata
    ) external payable withCustomAddressVerification (ruleID, msg.sender, _purefidata) {
        _buy(_to);
    }


    function buyForWithKYCPurefi2(address _to,
        bytes calldata _purefidata
    ) external payable withDefaultAddressVerification (DefaultRule.KYC, msg.sender, _purefidata) {
        _buy(_to);
    }



    function _buy(address _to) internal returns (uint256){
        uint oneCent = 0.01 * 10 ** 18;
        require(msg.value >= oneCent, "less than 0.01");
        uint tokensSent = msg.value / oneCent;
        ufi.transfer(_to, tokensSent);
        return tokensSent;
    }

}
