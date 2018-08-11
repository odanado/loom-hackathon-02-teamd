pragma solidity ^0.4.22;

import "./ColorStampToken.sol";

contract ChatRoom is ColorStampToken{
    struct Message {
        string text;
        uint256 stampToken;
        uint timestamp;
    }

    mapping(address => Message[]) internal messages;
    address[] internal users;

    event SendText(string text, uint256 stampToken, uint timestamp, address sender);

    function isuser(address sender) public view returns (bool) {
        return messages[sender].length > 0;
    }

    function sendText(string text) public {
        if (!isuser(msg.sender)) {
            users.push(msg.sender);
        }
        Message memory message = Message(text, 0, now);
        messages[msg.sender].push(message);
        emit SendText(message.text, message.stampToken, message.timestamp, msg.sender);
    }

    function sendStamp(uint256 stampToken) public {
        if (!isuser(msg.sender)) {
            users.push(msg.sender);
        }
        Message memory message = Message("", stampToken, now);
        messages[msg.sender].push(message);
        emit SendText(message.text, message.stampToken, message.timestamp, msg.sender);
    }

    function getMessagesCount() public view returns (uint256) {
        return messages[msg.sender].length;
    }

    function getMessage(address user, uint256 index) public view returns (string, uint256, uint) {
        Message[] storage userMessages = messages[user];
        require(index < userMessages.length);
        Message storage userMessage = userMessages[index];
        return (userMessage.text, userMessage.stampToken, userMessage.timestamp);
    }
    
    function getUsers() public view returns (address[]) {
        return users;
    }
}
