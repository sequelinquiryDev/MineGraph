import { BigInt, BigDecimal } from "@graphprotocol/graph-ts"

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
 * Helpers
 ******************************/
function bigIntToBigDecimal(value: BigInt, decimals: i32 = 18): BigDecimal {
  let precision = BigInt.fromI32(10).pow(decimals as u8).toBigDecimal()
  return value.toBigDecimal().div(precision)
}

function initializePool(poolId: string): Pool {
  let entity = Pool.load(poolId)
  if (entity == null) {
    entity = new Pool(poolId)
    entity.reserve0 = BigDecimal.zero()
    entity.reserve1 = BigDecimal.zero()
    entity.reserveUSD = BigDecimal.zero()
    entity.volumeUSD = BigDecimal.zero()
    entity.txCount = BigInt.zero()
    entity.totalValueLockedUSD = BigDecimal.zero()
  }
  return entity as Pool
}

function getTokenPriceUSD(tokenAddress: string): BigDecimal {
  return BigDecimal.fromString("1") // placeholder
}

function updateUSDValues(pool: Pool): void {
  let token0Price = getTokenPriceUSD(pool.token0.toHex())
  let token1Price = getTokenPriceUSD(pool.token1.toHex())
  pool.reserveUSD = pool.reserve0.times(token0Price).plus(pool.reserve1.times(token1Price))
  pool.totalValueLockedUSD = pool.reserveUSD
}

/******************************
 * V2 Handlers
 ******************************/
export function handleSync(event: V2SyncEvent): void {
  let pool = initializePool(event.address.toHex())
  pool.reserve0 = bigIntToBigDecimal(event.params.reserve0)
  pool.reserve1 = bigIntToBigDecimal(event.params.reserve1)
  pool.blockNumber = event.block.number
  pool.blockTimestamp = event.block.timestamp
  updateUSDValues(pool)
  pool.save()
}

export function handleSwapV2(event: V2SwapEvent): void {
  let pool = initializePool(event.address.toHex())
  pool.txCount = pool.txCount.plus(BigInt.fromI32(1))
  pool.blockNumber = event.block.number
  pool.blockTimestamp = event.block.timestamp
  updateUSDValues(pool)
  pool.save()
}

export function handleMintV2(event: V2MintEvent): void {
  let pool = initializePool(event.address.toHex())
  updateUSDValues(pool)
  pool.blockNumber = event.block.number
  pool.blockTimestamp = event.block.timestamp
  pool.save()
}

export function handleBurnV2(event: V2BurnEvent): void {
  let pool = initializePool(event.address.toHex())
  updateUSDValues(pool)
  pool.blockNumber = event.block.number
  pool.blockTimestamp = event.block.timestamp
  pool.save()
}

/******************************
 * V3 Handlers
 ******************************/
export function handleSwapV3(event: V3SwapEvent): void {
  let pool = initializePool(event.address.toHex())
  pool.txCount = pool.txCount.plus(BigInt.fromI32(1))
  pool.reserve0 = pool.reserve0.minus(bigIntToBigDecimal(event.params.amount0))
  pool.reserve1 = pool.reserve1.minus(bigIntToBigDecimal(event.params.amount1))
  pool.blockNumber = event.block.number
  pool.blockTimestamp = event.block.timestamp
  updateUSDValues(pool)
  pool.save()
}

export function handleMintV3(event: V3MintEvent): void {
  let pool = initializePool(event.address.toHex())
  pool.reserve0 = pool.reserve0.plus(bigIntToBigDecimal(event.params.amount0))
  pool.reserve1 = pool.reserve1.plus(bigIntToBigDecimal(event.params.amount1))
  pool.blockNumber = event.block.number
  pool.blockTimestamp = event.block.timestamp
  updateUSDValues(pool)
  pool.save()
}

export function handleBurnV3(event: V3BurnEvent): void {
  let pool = initializePool(event.address.toHex())
  pool.reserve0 = pool.reserve0.minus(bigIntToBigDecimal(event.params.amount0))
  pool.reserve1 = pool.reserve1.minus(bigIntToBigDecimal(event.params.amount1))
  pool.blockNumber = event.block.number
  pool.blockTimestamp = event.block.timestamp
  updateUSDValues(pool)
  pool.save()
}