// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract HarryToken {
    string public name = 'HarryToken';
    string public symbol = 'HT';
    string public standard = 'HarryToken v1.0';
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    function transfer(address _to, uint256 _value) public {
        require(balanceOf[msg.sender] < _value && _value > 0);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
    }
}
