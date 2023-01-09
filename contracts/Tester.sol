pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract tester is ERC721 {
    constructor() ERC721("MyCollectible", "MCO") {
    }

    // number to keep track of function calls
    uint number = 0 ;

    // event for testing nft subgraph
    event jiggy (
        address userAddress,
        string message,
        uint messageNumber
    );
    // placeholder token uri hard coded for nft
    string tokenURI1 = "jiggy.com";
    string[] msgArray;

    // function to mint nfts, and emit events
    function awardItem(string memory message)
        public
        returns (uint256)
    {
        number ++;

        // @dev Mints `tokenId` and transfers it to `to`.(to, tokenId)
        // mints nft for (msg.sender) with tokenId: number.
        _mint(msg.sender, number);
        tokenURI(number);

        emit jiggy(msg.sender, message, number);
        msgArray.push(message);

        return number;
    }

    function returnMsg() public view returns(string[] memory) {
        return msgArray;
    }
}