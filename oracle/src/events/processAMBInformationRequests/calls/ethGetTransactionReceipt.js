const { ASYNC_CALL_ERRORS } = require('../../../utils/constants')
const { serializeReceipt } = require('./serializers')

async function call(web3, data, foreignBlock) {
  let hash
  try{
    hash = web3.eth.abi.decodeParameter('bytes32', data)
  }catch{
    return [false, ASYNC_CALL_ERRORS.INPUT_DATA_HAVE_INCORRECT_FORMAT]
  }

  const receipt = await web3.eth.getTransactionReceipt(hash)

  if (receipt === null || receipt.blockNumber > foreignBlock.number) {
    return [false, ASYNC_CALL_ERRORS.NOT_FOUND]
  }

  return [true, serializeReceipt(web3, receipt)]
}

module.exports = {
  'eth_getTransactionReceipt(bytes32)': call
}
