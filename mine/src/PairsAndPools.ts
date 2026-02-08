import { BigInt, BigDecimal, Bytes } from "@graphprotocol/graph-ts"

import {
  Sync as V2SyncEvent,
  Swap as V2SwapEvent,
  Mint as V2MintEvent,
  Burn as V2BurnEvent
} from "../generated/templates/V2Pair/UniswapV2Pair"

import {
  Swap as V3SwapEvent,
  Mint as V3MintEvent,
  Burn as V3BurnEvent
} from "../generated/templates/V3Pool/UniswapV3Pool"

import { Pool } from "../generated/schema"

/******************************
 * Helpers
 ******************************/
function bigIntToBigDecimal(value: BigInt, decimals: i32 = 18): BigDecimal {
  let precision = BigInt.fromI32(10).pow(decimals as u8).toBigDecimal()
  return value.toBigDecimal().div(precision)
}

function loadPool(id: Bytes): Pool {
  let pool = Pool.load(id)
  return pool as Pool
}

/******************************
 * V2 Handlers
 ******************************/
export function handleSync(event: V2SyncEvent): void {
  let pool = loadPool(event.address)
  pool.reserve0 = bigIntToBigDecimal(event.params.reserve0)
  pool.reserve1 = bigIntToBigDecimal(event.params.reserve1)
  pool.txCount = pool.txCount.plus(BigInt.fromI32(1))
  pool.save()
}

export function handleSwapV2(event: V2SwapEvent): void {
  let pool = loadPool(event.address)
  pool.txCount = pool.txCount.plus(BigInt.fromI32(1))
  pool.save()
}

export function handleMintV2(event: V2MintEvent): void {
  let pool = loadPool(event.address)
  pool.save()
}

export function handleBurnV2(event: V2BurnEvent): void {
  let pool = loadPool(event.address)
  pool.save()
}

/******************************
 * V3 Handlers
 ******************************/
export function handleSwapV3(event: V3SwapEvent): void {
  let pool = loadPool(event.address)
  pool.txCount = pool.txCount.plus(BigInt.fromI32(1))
  pool.save()
}

export function handleMintV3(event: V3MintEvent): void {
  let pool = loadPool(event.address)
  pool.save()
}

export function handleBurnV3(event: V3BurnEvent): void {
  let pool = loadPool(event.address)
  pool.save()
}