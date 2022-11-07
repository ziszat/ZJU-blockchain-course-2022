// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment the line to use openzeppelin/ERC20
// You can use this dependency directly because it has been installed already
//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MyERC20.sol";

// Uncomment this line to use console.log
//import "hardhat/console.sol";

contract StudentSocietyDAO {

    // use a event if you want
    event ProposalInitiated(uint32 proposalIndex);
    event ProposalPassed(uint32 proposalIndex);
    event ProposalDenied(uint32 proposalIndex);
    event Award(uint256 aw);

    struct Proposal {
        uint32 index;      // index of this proposal
        address proposer;  // who make this proposal
        uint256 startTime; // proposal start time
        uint256 duration;  // proposal duration
        string name;       // proposal name
        // ...
        // TODO add any member if you want
        uint256 pros;
        uint256 cons;
    }

    MyERC20 public studentERC20;
    mapping(uint32 => Proposal) proposals; // A map from proposal index to proposal
    // ...
    // TODO add any variables if you want

    mapping(address => uint256) public awards;
    uint256 constant public ProposalCost = 10;
    uint256 constant public VoteCost = 5;
    uint256 constant public AWARD = 20;
    //uint256 constant public ORIGIN=100;
    uint256 constant public DURATION=120;
    uint256 public totalAmount;

    address public manager;

    uint32 counter;
    //uint32[] public proposal_index;
    //uint32[] public proposal_passed;
    //address[] public proposers;
    //address[] public voters;

    modifier onlyManager{
        require(msg.sender == manager);
        _;
    }

    constructor() {
        // maybe you need a constructor
        studentERC20 = new MyERC20("name", "symbol");
        manager=msg.sender;
    }

    function helloworld() pure external returns(string memory) {
        return "hello world";
    }

    // ...
    // TODO add any logic if you want
    function getProposalNumber() view external returns (uint32){
        return counter;
    }

    /*function getProposalIndex(uint256 i) view internal returns (uint32){
        return proposal_index[i];
    }*/

    function getProposer(uint32 i) view public returns (address){
        return proposals[i].proposer;
    }

    function getProposalName(uint32 i) view external returns (string memory){
        return proposals[i].name;
    }

    function isOutOfDue(uint32 i) view public returns (bool){
        if(proposals[i].startTime + proposals[i].duration <= block.timestamp){
            return true;
        }
        else{
            return false;
        }
    }

    function isPassed(uint32 i) view public returns (bool){
        //require(isOutOfDue(i), "This proposal haven't been out of due.");
        if(!isOutOfDue(i)){
            return false;
        }
        if(proposals[i].pros > proposals[i].cons){
            return true;
        }
        else{
            return false;
        }
    }

    function getAward(address usr) view external returns (uint256){
        return awards[usr];
    }

    /*function airdrop() external {
        studentERC20._mint(msg.sender, ORIGIN);
    }*/

    function award() public{
        require(awards[msg.sender]!=0,"No award.");
        studentERC20.transfer(msg.sender, awards[msg.sender]);
        awards[msg.sender]=0;
    }

    function propose(string memory _name) public {
        Proposal memory proposal;
        proposal.pros=0;
        proposal.cons=0;
        proposal.duration=DURATION;
        proposal.startTime=block.timestamp;
        proposal.index=counter;
        proposal.name=_name;
        proposal.proposer=msg.sender;

        proposals[counter]=proposal;
        counter+=1;

        studentERC20.transferFrom(msg.sender, address(this), ProposalCost);
        totalAmount += ProposalCost;

        emit ProposalInitiated(proposal.index);
    }

    function vote(uint32 index, bool agree) public {
        if(!isOutOfDue(index)){
            studentERC20.transferFrom(msg.sender, address(this), VoteCost);
            if(agree){
                proposals[index].pros += 1;
            }else{
                proposals[index].cons += 1;
            }
        }
        else{
            if(isPassed(index)){
                address proposer=getProposer(index);

                awards[proposer] += AWARD;
            }
        }
    }
}
