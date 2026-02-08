import {
  FeeAmountEnabled as FeeAmountEnabledEvent,
  OwnerChanged as OwnerChangedEvent,
  PoolCreated as PoolCreatedEvent
} from "../generated/UniswapV3Factory/UniswapV3Factory"

import {
  PairCreated as V2PairCreatedEvent
} from "../generated/UniswapV2Factory/UniswapV2Factory"

import {
  FeeAmountEnabled,
  OwnerChanged,
  PoolCreated,
  Pair
} from "../generated/schema"

/******************************
 * Uniswap V3 Factory Handlers *
 ******************************/
export function handleFeeAmountEnabled(event: FeeAmountEnabledEvent): void {
  let entity = new FeeAmountEnabled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fee = event.params.fee
  entity.tickSpacing = event.params.tickSpacing
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleOwnerChanged(event: OwnerChangedEvent): void {
  let entity = new OwnerChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldOwner = event.params.oldOwner
  entity.newOwner = event.params.newOwner
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleV3PoolCreated(event: PoolCreatedEvent): void {
  let entity = new PoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.fee = event.params.fee
  entity.tickSpacing = event.params.tickSpacing
  entity.pool = event.params.pool
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

/******************************
 * V2 Factory Handlers (Uni/Sushi/QuickSwap)
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