// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract HarryToken {
    string public name = 'HarryToken';
    string public symbol = 'HT';
    string public standard = 'HarryToken v1.0';
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(
            allowance[_from][msg.sender] >= _value && balanceOf[_from] >= _value
        );
        allowance[_from][msg.sender] -= _value;
        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
