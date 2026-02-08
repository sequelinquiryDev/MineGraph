import {
  PairCreated as V2PairCreatedEvent
} from "../generated/QuickswapV2Factory/QuickswapV2Factory"

import {
  PairCreated as SushiV2PairCreatedEvent
} from "../generated/SushiSwapV2Factory/SushiSwapV2Factory"

import {
  Pair
} from "../generated/schema"

/******************************
 * V2 Factory Handlers (Polygon: QuickSwap & SushiSwap)
 ******************************/
export function handleV2PairCreated(event: V2PairCreatedEvent): void {
  let entity = new Pair(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.pair = event.params.pair
  entity.param3 = event.params[2] // param3 is the last uint256 in PairCreated
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleSushiV2PairCreated(event: SushiV2PairCreatedEvent): void {
  let entity = new Pair(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.pair = event.params.pair
  entity.param3 = event.params[2] // param3 is the last uint256 in PairCreated
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}