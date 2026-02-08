import { Bytes, BigDecimal, BigInt } from "@graphprotocol/graph-ts"

import {
  FeeAmountEnabled as FeeAmountEnabledEvent,
  OwnerChanged as OwnerChangedEvent,
  PoolCreated as V3PoolCreatedEvent
} from "../generated/UniswapV3Factory/UniswapV3Factory"

import {
  PairCreated as V2PairCreatedEvent
} from "../generated/UniswapV2Factory/UniswapV2Factory"

import {
  FeeAmountEnabled,
  OwnerChanged,
  PoolCreated,
  PairCreated,
  Pool
} from "../generated/schema"

/******************************
 * Uniswap V3 Factory Handlers
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

export function handleV3PoolCreated(event: V3PoolCreatedEvent): void {
  // Event history
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

  // ***** ACTUAL POOL CREATION *****
  let pool = new Pool(event.params.pool)
  pool.token0 = event.params.token0
  pool.token1 = event.params.token1
  pool.feeTier = event.params.fee
  pool.tickSpacing = event.params.tickSpacing
  pool.dexType = "v3"
  pool.reserve0 = BigDecimal.zero()
  pool.reserve1 = BigDecimal.zero()
  pool.reserveUSD = BigDecimal.zero()
  pool.volumeUSD = BigDecimal.zero()
  pool.txCount = BigInt.zero()
  pool.totalValueLockedUSD = BigDecimal.zero()
  pool.createdAtBlock = event.block.number
  pool.createdAtTimestamp = event.block.timestamp
  pool.save()
}

/******************************
 * V2 Factory Handlers
 ******************************/
export function handleV2PairCreated(event: V2PairCreatedEvent): void {
  // Event history
  let entity = new PairCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.pair = event.params.pair
  entity.param3 = event.params.param3
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  // ***** ACTUAL POOL CREATION *****
  let pool = new Pool(event.params.pair)
  pool.token0 = event.params.token0
  pool.token1 = event.params.token1
  pool.dexType = "v2"
  pool.reserve0 = BigDecimal.zero()
  pool.reserve1 = BigDecimal.zero()
  pool.reserveUSD = BigDecimal.zero()
  pool.volumeUSD = BigDecimal.zero()
  pool.txCount = BigInt.zero()
  pool.totalValueLockedUSD = BigDecimal.zero()
  pool.createdAtBlock = event.block.number
  pool.createdAtTimestamp = event.block.timestamp
  pool.save()
}