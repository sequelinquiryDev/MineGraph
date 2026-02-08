import { Bytes, BigDecimal, BigInt } from "@graphprotocol/graph-ts"

// Events
import { PoolCreated as V3PoolCreatedEvent } from "../generated/UniswapV3Factory/UniswapV3Factory"
import { PairCreated as V2PairCreatedEvent } from "../generated/UniswapV2Factory/UniswapV2Factory"
import { PairCreated as SushiPairCreatedEvent } from "../generated/SushiSwapV2Factory/SushiSwapV2Factory"

// Entities
import { PoolCreated, PairCreated, Pool } from "../generated/schema"

// Templates
import { V2Pair, V3Pool } from "../generated/templates"

/******************************
 * Uniswap V3 Factory Handler
 ******************************/
export function handleV3PoolCreated(event: V3PoolCreatedEvent): void {
  // Save immutable event history
  let entity = new PoolCreated(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.fee = event.params.fee
  entity.tickSpacing = event.params.tickSpacing
  entity.pool = event.params.pool
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  // Create Pool entity
  let pool = new Pool(event.params.pool)
  pool.token0 = event.params.token0
  pool.token1 = event.params.token1
  pool.feeTier = event.params.fee
  pool.tickSpacing = event.params.tickSpacing
  pool.dexType = "v3"
  pool.reserve0 = BigDecimal.zero()
  pool.reserve1 = BigDecimal.zero()
  pool.txCount = BigInt.zero()
  pool.createdAtBlock = event.block.number
  pool.createdAtTimestamp = event.block.timestamp
  pool.save()

  // Instantiate template to track live pool events
  V3Pool.create(event.params.pool)
}

/******************************
 * Uniswap V2 Factory Handler
 ******************************/
export function handleV2PairCreated(event: V2PairCreatedEvent): void {
  // Save immutable event history
  let entity = new PairCreated(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.pair = event.params.pair
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  // Create Pool entity
  let pool = new Pool(event.params.pair)
  pool.token0 = event.params.token0
  pool.token1 = event.params.token1
  pool.dexType = "v2"
  pool.reserve0 = BigDecimal.zero()
  pool.reserve1 = BigDecimal.zero()
  pool.txCount = BigInt.zero()
  pool.createdAtBlock = event.block.number
  pool.createdAtTimestamp = event.block.timestamp
  pool.save()

  // Instantiate template to track live pool events
  V2Pair.create(event.params.pair)
}

/******************************
 * SushiSwap V2 Factory Handler
 ******************************/
export function handleSushiPairCreated(event: SushiPairCreatedEvent): void {
  // Reuse the same logic as Uniswap V2
  handleV2PairCreated(event)
}