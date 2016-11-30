// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import moment from 'moment';

function getBlock (blocks, _blockNumber) {
  const blockNumber = _blockNumber.toNumber();
  const block = blocks[blockNumber];

  return blockNumber && block
    ? block
    : {};
}

export function formatBlockNumber (blocks, blockNumber) {
  const block = getBlock(blocks, blockNumber);

  return !block.blockNumber
    ? 'Pending'
    : block.blockNumber.toFormat();
}

export function formatBlockTimestamp (blocks, blockNumber) {
  const block = getBlock(blocks, blockNumber);

  return !block.timestamp
    ? formatBlockNumber(blocks, blockNumber)
    : moment(block.timestamp).fromNow();
}
