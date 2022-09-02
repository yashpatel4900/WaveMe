// SPDX-License-Identifier: MIT

// Self Written Contract
pragma solidity ^0.8.0;

contract WaveMe {
    address immutable owner;
    uint256 public constant prizeAmount = 1 * 10**17; // 0.1 ether
    uint256 public totalCount;
    address[] public wavers;
    mapping(address => string[]) public messageFromWaver;
    struct WaveDetail {
        address sender;
        string message;
        uint256 date;
        uint256 wavedNumber;
    }

    WaveDetail[] public allWaves;

    mapping(address => uint256) lastWavedAt;

    constructor() payable {
        owner = msg.sender;
        totalCount = 0;
    }

    receive() external payable {
        require(msg.sender == owner);
    }

    event waveComplete(address sender, string message, uint256 date);

    function waveAtMe(string memory _message) public payable {
        require(lastWavedAt[msg.sender] + 1 minutes < block.timestamp);

        totalCount += 1;

        wavers.push(msg.sender);
        messageFromWaver[msg.sender].push(_message);

        allWaves.push(
            WaveDetail(msg.sender, _message, block.timestamp, totalCount)
        );
        lastWavedAt[msg.sender] = block.timestamp;

        if (totalCount % 3 == 0 && prizeAmount <= address(this).balance) {
            bool success = payable(msg.sender).send(prizeAmount);
            require(success, "Failed to withdraw money from contract.");
        }

        emit waveComplete(msg.sender, _message, block.timestamp);
    }

    // Shows all the messages sent from a user to you
    function showMessage(address _address)
        public
        view
        returns (string[] memory messagesAre)
    {
        string[] memory messages = messageFromWaver[_address];
        return messages;
    }

    // Shows total number of messages sent to you
    function showTotalCount() public view returns (uint256) {
        return totalCount;
    }

    // Shows complete list of messages
    function allMessages() public view returns (WaveDetail[] memory) {
        return allWaves;
    }

    // function fundContract() public payable{
    //     if(msg.sender == owner){
    //     (bool success, ) = payable(address(this)).call{value: msg.value}("");
    //     require(success, "Failed to fund this Contract.");
    //     }
    // }

    // Shows the current contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Withdraw Funds from the contract
    function withdrawFunds() public payable {
        require(
            msg.sender == owner,
            "Only Owner of the contract is allowed to withdraw funds."
        );
        bool success = payable(owner).send(address(this).balance);
        require(success, "Failed to withdraw amount");
    }
}
