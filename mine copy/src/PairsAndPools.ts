import { BigInt } from "@graphprotocol/graph-ts"

import {
  Sync as V2SyncEvent,
  Swap as V2SwapEvent,
  Mint as V2MintEvent,
  Burn as V2BurnEvent
} from "../generated/templates/V2Pair/V2Pair"

import {
  Swap as V3SwapEvent,
  Mint as V3MintEvent,
  Burn as V3BurnEvent
} from "../generated/templates/V3Pool/V3Pool"

import { Pool } from "../generated/schema"

/******************************
 * V2 Pair Handlers
 ******************************/
export function handleSync(event: V2SyncEvent): void {
  let poolId = event.address.toHex()
  let entity = Pool.load(poolId)
  if (entity == null) {
    entity = new Pool(poolId)
    entity.reserve0 = BigInt.fromI32(0)
    entity.reserve1 = BigInt.fromI32(0)
    entity.reserveUSD = BigInt.fromI32(0)
    entity.volumeUSD = BigInt.fromI32(0)
    entity.txCount = BigInt.fromI32(0)
    entity.totalValueLockedUSD = BigInt.fromI32(0)
  }
  entity.reserve0 = event.params.reserve0
  entity.reserve1 = event.params.reserve1
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.save()
}

export function handleSwapV2(event: V2SwapEvent): void {
  let poolId = event.address.toHex()
  let entity = Pool.load(poolId)
  if (entity == null) {
    entity = new Pool(poolId)
  }
  entity.txCount = entity.txCount.plus(BigInt.fromI32(1))
  // For simplicity, volumeUSD accumulation can be calculated off-chain or extended later
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.save()
}

export function handleMintV2(event: V2MintEvent): void {
  let poolId = event.address.toHex()
  let entity = Pool.load(poolId)
  if (entity == null) {
    entity = new Pool(poolId)
  }
  // Optional: track liquidity inflow
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.save()
}

export function handleBurnV2(event: V2BurnEvent): void {
  let poolId = event.address.toHex()
  let entity = Pool.load(poolId)
  if (entity == null) {
    entity = new Pool(poolId)
  }
  // Optional: track liquidity outflow
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.save()
}

/******************************
 * V3 Pool Handlers
 ******************************/
export function handleSwapV3(event: V3SwapEvent): void {
  let poolId = event.address.toHex()
  let entity = Pool.load(poolId)
  if (entity == null) {
    entity = new Pool(poolId)
    entity.reserve0 = BigInt.fromI32(0)
    entity.reserve1 = BigInt.fromI32(0)
    entity.reserveUSD = BigInt.fromI32(0)
    entity.volumeUSD = BigInt.fromI32(0)
    entity.txCount = BigInt.fromI32(0)
    entity.totalValueLockedUSD = BigInt.fromI32(0)
  }
  entity.txCount = entity.txCount.plus(BigInt.fromI32(1))
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.save()
}

export function handleMintV3(event: V3MintEvent): void {
  let poolId = event.address.toHex()
  let entity = Pool.load(poolId)
  if (entity == null) {
    entity = new Pool(poolId)
  }
  // track liquidity inflow if needed
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.save()
}

export function handleBurnV3(event: V3BurnEvent): void {
  let poolId = event.address.toHex()
  let entity = Pool.load(poolId)
  if (entity == null) {
    entity = new Pool(poolId)
  }
  // track liquidity outflow if needed
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.save()
}