import { BigInt } from "@graphprotocol/graph-ts"

import {
  Sync as V2SyncEvent,
  Swap as V2SwapEvent,
  Mint as V2MintEvent,
  Burn as V2BurnEvent
} from "../generated/templates/V2Pair/V2Pair"

import { Pool } from "../generated/schema"

/******************************
 * V2 Pair Handlers (Polygon)
 * Applies to QuickSwap V2 & SushiSwap V2
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