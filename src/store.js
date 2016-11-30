// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import BigNumber from 'bignumber.js';
import { isEqual } from 'lodash';
import { action, observable, transaction } from 'mobx';

import registryAbi from './abi/registry.json';
import votingAbi from './abi/voting.json';

const { api } = window.parity;

export default class Store {
  @observable accounts = [];
  @observable answerEvents = [];
  @observable answerFee = new BigNumber(0);
  @observable blockNumber = new BigNumber(0);
  @observable blocks = {};
  @observable count = 0;
  @observable currentAccount = null;
  @observable error = null;
  @observable hasCurrentVoted = false;
  @observable question = null;
  @observable questionEvents = [];
  @observable questionFee = new BigNumber(0);
  @observable questionIndex = -1;
  @observable questionLoading = false;
  @observable queryIndex = 0;
  @observable showNewAnswerModal = false;
  @observable showNewQuestionModal = false;
  @observable totalVotes = new BigNumber(0);
  @observable totalValue = new BigNumber(0);

  constructor () {
    this._registry = null;
    this._voting = null;
    this._subIdBlockNumber = 0;
    this._subIdAnswers = 0;
    this._subIdQuestions = 0;

    this._questionEventsMined = [];
    this._questionEventsPending = [];

    this.initialise();
  }

  @action addBlock = (block) => {
    const blockNumber = block.blockNumber.toNumber();

    this.blocks = Object.assign({}, this.blocks, { [blockNumber]: block });
  }

  @action setAccounts = (accountsInfo) => {
    transaction(() => {
      this.addresses = Object
        .keys(accountsInfo)
        .map((address) => {
          const account = accountsInfo[address];
          account.address = address;
          return account;
        });

      this.accounts = this.addresses.filter((account) => account.uuid);
      this.currentAccount = this.accounts[0];
    });

    return this.accounts;
  }

  @action setBlockNumber = (blockNumber) => {
    this.blockNumber = blockNumber;
  }

  @action setCurrentAccount = (address) => {
    this.currentAccount = this.accounts.find((account) => account.address === address);
    this.checkVoteStatus();
  }

  @action setStats = (count, totalValue, totalVotes, answerFee, questionFee) => {
    transaction(() => {
      if (this.count !== count) {
        this.count = count;
      }

      if (!totalValue.eq(this.totalValue)) {
        this.totalValue = totalValue;
      }

      if (!totalVotes.eq(this.totalVotes)) {
        this.totalVotes = totalVotes;
      }

      if (!answerFee.eq(this.answerFee)) {
        this.answerFee = answerFee;
      }

      if (!questionFee.eq(this.questionFee)) {
        this.questionFee = questionFee;
      }
    });
  }

  @action setError = (error) => {
    this.error = error;
  }

  @action setVoteStatus = (hasCurrentVoted) => {
    this.hasCurrentVoted = hasCurrentVoted;
  }

  @action setQuestion = (questionIndex, question) => {
    transaction(() => {
      if (!isEqual(this.question, question)) {
        this.question = question;
      }
      this.questionIndex = questionIndex;
      this.quetionLoading = false;
      this.queryIndex = questionIndex;
    });
  }

  @action setQuestionEvents = (pending, mined) => {
    transaction(() => {
      this._questionEventsMined = mined;
      this._questionEventsPending = pending;
      this.questionEvents = pending.concat(mined);
    });
  }

  @action setQuestionLoading = (loading) => {
    this.questionLoading = loading;
  }

  @action setQueryIndex = (queryIndex) => {
    this.queryIndex = parseInt(queryIndex, 10);
  }

  @action toggleNewAnswerModal = () => {
    this.showNewAnswerModal = !this.showNewAnswerModal;
  }

  @action toggleNewQuestionModal = () => {
    this.showNewQuestionModal = !this.showNewQuestionModal;
  }

  loadQuery = () => {
    this.loadQuestion(this.queryIndex);
  }

  initialise () {
    return Promise
      .all([
        this.attachBlockNumber(),
        this.attachRegistry(),
        this.loadAccounts()
      ])
      .then(() => {
        return this.attachContract();
      })
      .catch((error) => {
        console.error('Store.initialise', error);
        this.setError(error);
      });
  }

  nextQuestion = () => {
    const index = this.questionIndex + 1;
    this.loadQuestion(index <= this.count ? index : 1);
  }

  prevQuestion = () => {
    const index = this.questionIndex - 1;
    this.loadQuestion(index > 0 ? index : this.count);
  }

  randomQuestion = () => {
    this.loadQuestion(Math.floor(Math.random() * this.count) + 1);
  }

  loadAccounts () {
    return api.parity
      .accounts()
      .then((accountsInfo) => {
        this.setAccounts(accountsInfo);
      })
      .catch((error) => {
        console.error('Store:loadAccounts', error);
        this.setError(error);
      });
  }

  loadQuestion (index) {
    if (!this._voting) {
      console.warn('Store:loadQuestion', 'contract has not been attached');
      return;
    }

    if (index > this.count) {
      index = this.count;
    } else if (index < 1) {
      index = 1;
    }

    const isNew = index !== this.questionIndex;

    if (isNew) {
      this.setQuestionLoading(true);
    }

    return this._voting.instance
      .get.call({}, [index - 1])
      .then(([owner, valueNo, valueYes, votesNo, votesYes, question]) => {
        this.setQuestion(index, {
          owner, valueNo, valueYes, votesNo, votesYes, question
        });
        this.checkVoteStatus();

        if (isNew) {
          if (this._subIdAnswers) {
            this._voting.unsubscribe(this._subIdAnswers);
            this._subIdAnswers = 0;
          }

          return this._voting
            .subscribe('NewAnswer', {
              fromBlock: 0,
              toBlock: 'pending',
              limit: 50,
              topics: [index]
            }, this.answerEventCallback)
            .then((subscriptionId) => {
              this._subIdAnswers = subscriptionId;
            });
        }
      })
      .catch((error) => {
        console.error('Store:loadQuestion', error);
        this.setError(error);
      });
  }

  getStats () {
    if (!this._voting) {
      console.warn('Store:getStats', 'contract has not been attached');
      return;
    }

    return Promise
      .all([
        this._voting.instance.count.call(),
        this._voting.instance.totalValue.call(),
        this._voting.instance.totalVotes.call(),
        this._voting.instance.answerFee.call(),
        this._voting.instance.questionFee.call()
      ])
      .then(([count, totalValue, totalVotes, answerFee, questionFee]) => {
        this.setStats(count.toNumber(), totalValue, totalVotes, answerFee, questionFee);
      })
      .catch((error) => {
        console.warn('Store:getStats', error);
      });
  }

  attachBlockNumber () {
    return api
      .subscribe('eth_blockNumber', (error, blockNumber) => {
        if (error) {
          console.warn('Store:attachBlockNumber', error);
          return;
        }

        this.setBlockNumber(blockNumber);
        this.getStats();
        this.loadQuestion(this.questionIndex);
      })
      .then((subscriptionId) => {
        this._subIdBlockNumber = subscriptionId;
      })
      .catch((error) => {
        console.error('Store:attachBlockNumber', error);
        this.setError(error);
      });
  }

  attachRegistry () {
    return api.parity
      .registryAddress()
      .then((registryAddress) => {
        console.log(`the registry was found at ${registryAddress}`);
        this._registry = api.newContract(registryAbi, registryAddress);
      })
      .catch((error) => {
        console.error('Store:attachRegistry', error);
        this.setError(error);
      });
  }

  attachContract () {
    return this._registry.instance
      .getAddress.call({}, [api.util.sha3('jg-dapp-voting'), 'A'])
      .then((votingAddress) => {
        if (new BigNumber(votingAddress).eq(0)) {
          throw new Error('Unable to find the contract in the registry');
        }

        console.log(`the contract was found at ${votingAddress}`);
        this._voting = api.newContract(votingAbi, votingAddress);

        return this._voting.subscribe('NewQuestion', {
          fromBlock: 0,
          toBlock: 'pending',
          limit: 50
        }, this.questionEventCallback);
      })
      .then((subscriptionId) => {
        this._subIdQuestions = subscriptionId;
        return this.getStats();
      })
      .then(() => {
        if (this.count !== 0) {
          this.randomQuestion();
        }
      })
      .catch((error) => {
        console.error('Store:attachContract', error);
        this.setError(error);
      });
  }

  sortEvents = (a, b) => {
    return b.blockNumber.cmp(a.blockNumber) || b.logIndex.cmp(a.logIndex);
  }

  logToEvent = (log) => {
    const key = api.util.sha3(JSON.stringify(log));
    const { blockNumber, logIndex, transactionHash, transactionIndex, params, type } = log;

    return {
      type: log.event,
      state: type,
      blockNumber,
      logIndex,
      transactionHash,
      transactionIndex,
      params: Object.keys(params).reduce((data, name) => {
        data[name] = params[name].value;
        return data;
      }, {}),
      key
    };
  }

  answerEventCallback = (error, _logs) => {
    if (error) {
      console.warn('Store:answerEventCallback', error);
      return;
    }
  }

  questionEventCallback = (error, _logs) => {
    if (error) {
      console.warn('Store:questionEventCallback', error);
      return;
    }

    const logs = _logs.map(this.logToEvent);

    const mined = logs
      .filter((log) => log.state === 'mined')
      .map((log) => {
        const blockNumber = log.blockNumber.toNumber();

        if (blockNumber && !this.blocks[blockNumber]) {
          api.eth
            .getBlockByNumber(blockNumber)
            .then((block) => {
              block.blockNumber = log.blockNumber;
              this.addBlock(block);
            });
        }

        return Object.assign(log, { block: this.blocks[blockNumber] });
      })
      .reverse()
      .concat(this._questionEventsMined)
      .sort(this.sortEvents);

    const pending = logs
      .filter((log) => log.state === 'pending')
      .reverse()
      .filter((event) => !this._questionEventsPending.find((log) => log.params.method === event.params.method))
      .concat(this._questionEventsPending)
      .filter((event) => !this._questionEventsMined.find((log) => log.params.method === event.params.method))
      .sort(this.sortEvents);

    this.setQuestionEvents(pending, mined);
  }

  checkVoteStatus () {
    const options = { from: this.currentAccount.address };
    const values = [this.questionIndex - 1];

    return this._voting.instance
      .hasSenderVoted.call(options, values)
      .then((hasCurrentVoted) => {
        this.setVoteStatus(hasCurrentVoted);
      })
      .catch((error) => {
        console.warn('Store:checkVoteStatus', error);
      });
  }

  newAnswer (isYes) {
    const options = { from: this.currentAccount.address, value: this.answerFee };
    const values = [this.questionIndex - 1, isYes];

    return this._voting.instance
      .newAnswer.estimateGas(options, values)
      .then((gas) => {
        options.gas = gas.mul(1.2).toFixed(0);
        return this._voting.instance.newAnswer.postTransaction(options, values);
      })
      .catch((error) => {
        console.error('Store:newAnswer', error);
        this.setError(error);
      });
  }

  newQuestion (question) {
    const options = { from: this.currentAccount.address, value: this.questionFee };
    const values = [question];

    return this._voting.instance
      .newQuestion.estimateGas(options, values)
      .then((gas) => {
        options.gas = gas.mul(1.2).toFixed(0);
        return this._voting.instance.newQuestion.postTransaction(options, values);
      })
      .catch((error) => {
        console.error('Store:newQuestion', error);
        this.setError(error);
      });
  }
}
