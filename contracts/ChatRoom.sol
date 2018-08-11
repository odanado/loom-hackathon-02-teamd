pragma solidity ^0.4.22;

contract ChatRoom {
    struct Message {
        string text;
        uint timestamp;
    }

    mapping(address => Message[]) internal messages;
    address[] internal users;

    event SendText(string text, uint timestamp, address sender);

    function isuser(address sender) public view returns (bool) {
        return messages[sender].length > 0;
    }

    function sendText(string text) public {
        if (!isuser(msg.sender)) {
            users.push(msg.sender);
        }
        Message memory message = Message(text, now);
        messages[msg.sender].push(message);
        emit SendText(message.text, message.timestamp, msg.sender);
    }

    function getMessagesCount() public view returns (uint256) {
        return messages[msg.sender].length;
    }

    function getMessage(address user, uint256 index) public view returns (string, uint) {
        Message[] storage userMessages = messages[user];
        require(index < userMessages.length);
        Message storage userMessage = userMessages[index];
        return (userMessage.text, userMessage.timestamp);
    }
    
    function getUsers() public view returns (address[]) {
        return users;
    }
}
