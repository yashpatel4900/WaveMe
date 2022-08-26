// SPDX-License-Identifier: MIT

// Self Written Contract
pragma solidity ^0.8.0;

contract WaveMe {
    address immutable owner;
    uint256 public totalCount;
    address[] public wavers;
    mapping(address => string[]) public messageFromWaver;
    struct WaveDetail {
        address sender;
        string message;
        uint256 date;
        uint256 wavedNumber;
    }

    WaveDetail[] allWaves;

    mapping(address => uint256) lastWavedAt;

    constructor() {
        owner = msg.sender;
        totalCount = 0;
    }

    event waveComplete(address sender, string message, uint256 date);

    function waveAtMe(string memory _message) external {
        require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp);

        totalCount += 1;

        wavers.push(msg.sender);
        messageFromWaver[msg.sender].push(_message);

        allWaves.push(
            WaveDetail(msg.sender, _message, block.timestamp, totalCount)
        );
        lastWavedAt[msg.sender] = block.timestamp;

        emit waveComplete(msg.sender, _message, block.timestamp);
    }

    function showMessage(address _address)
        public
        view
        returns (string[] memory messagesAre)
    {
        string[] memory messages = messageFromWaver[_address];
        return messages;
    }

    function showTotalCount() public view returns (uint256) {
        return totalCount;
    }

    function allMessages() public view returns (WaveDetail[] memory) {
        return allWaves;
    }
}
