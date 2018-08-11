pragma solidity ^0.4.22;

contract ChatRoom {
    mapping(address => string[]) internal messages;
    address[] internal users;

    event SendMessage(string message, address sender);

    function isuser(address sender) public view returns (bool) {
        return messages[sender].length > 0;
    }

    function sendMessage(string message) public {
        if (!isuser(msg.sender)) {
            users.push(msg.sender);
        }
        messages[msg.sender].push(message);
        emit SendMessage(message, msg.sender);
    }

    function getMessagesCount() public view returns (uint256) {
        return messages[msg.sender].length;
    }

    function getMessage(address user, uint256 index) public view returns (string) {
        string[] storage userMessages = messages[user];
        require(index < userMessages.length);
        return userMessages[index];
    }
    
    function getUsers() public view returns (address[]) {
        return users;
    }
}
