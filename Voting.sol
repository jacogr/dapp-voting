//! MIT
//! A simple voting with account balanaces contract
//! Jaco Greeff <jacogr@gmail.com>

pragma solidity ^0.4.1;

// standard Owner interface
contract Owned {
  // emitted when a new owner is set
  event NewOwner(address indexed old, address indexed current);

  // only the owner is allowed to modify
  modifier only_owner {
    if (msg.sender != owner) throw;
    _;
  }

  // set the owner to the contract creator
  address public owner = msg.sender;

  // set a new owner
  function setOwner(address _newOwner) only_owner {
    NewOwner(owner, _new);
    owner = _newOwner;
  }
}

// the voting contract
contract Voting is Owned {
  // emitted when a new question was asked
  NewQuestion(address indexed owner, uint index, string question);

  // emitted when a new answer is provided
  NewAnswer(uint indexed index, uint value, bool isYes);

  // define a question with totals & voters
  struct Question {
    address owner;
    uint valueNo;
    uint valueYes;
    uint votesNo;
    uint votesYes;
    string question;
    mapping (address => bool) voters;
  }

  // the list of questions
  Question[] questions;

  // the applicable question & answer fees
  uint public answerFee = 0;
  uint public questionFee = 5 finney;

  // has the fee been paid to answer
  modifier is_answer_paid {
    if (msg.value < answerFee) throw;
    _;
  }

  // has the fee been paid to ask a question
  modifier is_question_paid {
    if (msg.value < questionFee) throw;
    _;
  }

  // is there an actual question at this index
  modifier is_valid_question (uint _index) {
    if (_index >= questions.length) throw;
    _;
  }

  // is the question of acceptable length
  modifier is_short_question (string _question) {
    if (bytes(_question).length > 160) throw;
    _;
  }

  // has the voter not voted already
  modifier has_not_voted (uint _index) {
    if (questions[_index].voters[msg.sender] == true) throw;
    _;
  }

  // the number of questions asked
  function count () constant returns (uint) {
    return questions.length;
  }

  // details for a specific question
  function get (uint _index) constant returns (address owner, uint valueNo, uint valueYes, uint votesNo, uint votesYes, string question) {
    Question q = questions[_index];

    owner = q.owner;
    valueNo = q.valueNo;
    valueYes = q.valueYes;
    votesNo = q.votesNo;
    votesYes = q.votesYes;
    question = q.question;
  }

  // tests if the sender has voted
  function hasSenderVoted () constant returns (bool) {
    return questions[_index].voters[msg.sender];
  }

  // ask a new question
  function newQuestion (string _question) payable is_question_paid is_short_question(_question) returns (bool) {
    uint index = questions.length;

    questions.length += 1;
    questions[index].owner = msg.sender;
    questions[index].question = _question;

    NewQuestion(msg.sender, index, _question);

    return true;
  }

  // answer a question
  function newAnswer (uint _index, bool _isYes) payable is_answer_paid is_valid_question(_index) has_not_voted(_index) return (bool) {
    questions[_index].voters[msg.sender] = true;

    if (_isYes) {
      questions[_index].valueYes += msg.sender.balance;
      questions[_index].votesYes += 1;
    } else {
      questions[_index].valueNo += msg.sender.balance;
      questions[_index].votesNo += 1;
    }

    newAnswer(_index, msg.sender.balance, _isYes);

    return true;
  }

  // adjust the fee for providing answers
  function setAnswerFee (uint _fee) only_owner {
    answerFee = _fee;
  }

  // adjust the fee for asking questions
  function setQuestionFee (uint _fee) only_owner {
    questionFee = _fee;
  }

  // drain all accumulated funds
  function drain() only_owner {
    if (!msg.sender.send(this.balance)) {
      throw;
    }
  }
}
