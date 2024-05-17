const { toBN } = require('web3').utils

const { ASYNC_CALL_ERRORS } = require('../../../utils/constants')

async function call(web3, data, foreignBlock) {
  let address
  try{
    address = web3.eth.abi.decodeParameter('address', data)
  }catch{() => {
    return [false, ASYNC_CALL_ERRORS.INPUT_DATA_HAVE_INCORRECT_FORMAT]
  }}

  const nonce = await web3.eth.getTransactionCount(address, foreignBlock.number)

  return [true, web3.eth.abi.encodeParameter('uint256', nonce)]
}

async function callArchive(web3, data, foreignBlock) {
  let address,blockNumber
 try{
  const decoded = web3.eth.abi.decodeParameters(['address', 'uint256'], data)
  address = decoded[0]
  blocknumber = decoded[1]
}catch{() => {
    return [false, ASYNC_CALL_ERRORS.INPUT_DATA_HAVE_INCORRECT_FORMAT]
  }}

  if (toBN(blockNumber).gt(toBN(foreignBlock.number))) {
    return [false, ASYNC_CALL_ERRORS.BLOCK_IS_IN_THE_FUTURE]
  }

  const nonce = await web3.eth.getTransactionCount(address, blockNumber)

  return [true, web3.eth.abi.encodeParameter('uint256', nonce)]
}

module.exports = {
  'eth_getTransactionCount(address)': call,
  'eth_getTransactionCount(address,uint256)': callArchive
}
