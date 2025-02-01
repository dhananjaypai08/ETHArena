// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseArena is ERC721URIStorage, Ownable{
    mapping(address => uint256) public reputation_score;
    mapping(address => uint256) public rewards_earned;
    mapping(address => uint256) public percentile;
    mapping(address => Game[]) public games_of_user;
    mapping(address => string) public AIResponse;
    uint256 public tokenId;
    address[] public all_users;

    struct Game{
        address user;
        uint256 reputationScore;
        uint256 rewardsEarned;
        string oneLiner;
    }


    constructor() ERC721("BaseArena", "BARN") Ownable(msg.sender){}


    function safeMint(uint256 rewards_earnedUser, string memory uri,  address to) public {
        reputation_score[to] += 1;
        rewards_earned[to] += rewards_earnedUser;
        tokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        all_users.push(to);

    }

    function getAllUsers() public view returns(address[] memory){
        return all_users;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal {
        require(from == address(0), "Err: token transfer is BLOCKED");   
        _beforeTokenTransfer(from, to, firstTokenId, batchSize);  
    }

    function saveResponse(address user, string memory data) public {
        AIResponse[user] = data;
    }


}