pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract ColorStampToken is ERC721Token {
  uint256 internal nextTokenId = 0;

  event MintColorStampToken(uint256 tokenId, address sender);

  constructor() public ERC721Token("ColorStampToken", "CSTKN") {}

  function mintColorStampToken() external {
    uint256 tokenId = nextTokenId;
    nextTokenId = nextTokenId.add(1);
    super._mint(msg.sender, tokenId);

    emit MintColorStampToken(tokenId, msg.sender);
  }

  function setColorStampTokenURI(uint256 _tokenId, string _message) external onlyOwnerOf(_tokenId) {
    super._setTokenURI(_tokenId, _message);
  }

  function burnColorStampToken(uint256 _tokenId) external onlyOwnerOf(_tokenId) {
    super._burn(msg.sender, _tokenId);
  }
}