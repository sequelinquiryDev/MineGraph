import { PairCreated as SushiPairCreatedEvent } from "../generated/SushiSwapV2Factory/SushiSwapV2Factory"
import { PairCreated } from "../generated/schema"

/**
 * handlePairCreated
 * Triggered whenever a new pair is created in the SushiSwap V2 Factory
 */
export function handlePairCreated(event: SushiPairCreatedEvent): void {
  // Unique ID for this entity: transaction hash + log index
  let entity = new PairCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  // Populate entity fields from the event
  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.pair = event.params.pair
  entity.param3 = event.params.param3 // typically the pair index / total count

  // Store blockchain metadata
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // Save entity to the subgraph store
  entity.save()
}
