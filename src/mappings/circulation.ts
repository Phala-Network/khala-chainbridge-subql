import { Circulation } from '../types/models/Circulation'
import { SubstrateEvent } from "@subql/types"
import { IEvent } from '@polkadot/types/types'
import { U128 } from '@polkadot/types'
import { AccountInfo, Balance } from "@polkadot/types/interfaces";

// 1000M PHA, contains Phala/Khala/Ethereum
const TOTAL_SUPPLY = BigInt('1000000000000000000000')
// Mint and locked on Phala account: 42fy3tTMPbgxbRqkQCyvLoSoPHwUPM3Dy5iqHYhF9RvD5XAP
const CROWDLOAN_RESERVED = BigInt('21827455920298928711')
// Unused mining PHA locked on Ethereum account: 0x4731bc41b3cca4c2883b8ebb68cb546d5b3b4dd6
const ETHEREUM_MINING_RESERVED = BigInt('463200000000000000000')
// Khala mining reserve account
const KHALA_MINING_RESERVE_ACCOUNT = '5EYCAe5iixJKLJE7D1zaaRxUiy2bL4KUKqZBSckPw3iWSyvk'

let lastUpdatedBlock = BigInt(0);

// collect total minner rewards
export async function handleCirculationSettled(event: SubstrateEvent): Promise<void> {
    let blockHeight = event.block.block.header.number.toBigInt()

    // So far the only pattern that will influence the result is balance of mining subsidy account,
    // that's why we can move circulation computioin to here
    try {
        let circulation = await Circulation.get(`circulation-${blockHeight.toString()}`)
        // Only calculate onece
        if (circulation === undefined && (blockHeight - lastUpdatedBlock  >= BigInt(300)) ) {
            let b_miningSubsidy = await api.query.system.account(KHALA_MINING_RESERVE_ACCOUNT)
            let miningSubsidy = ((b_miningSubsidy as AccountInfo).data.free as Balance).toBigInt()
    
            let circulation = new Circulation(`circulation-${blockHeight.toString()}`)
            circulation.amount = TOTAL_SUPPLY - ETHEREUM_MINING_RESERVED - CROWDLOAN_RESERVED - miningSubsidy
            circulation.blockHeight = blockHeight
            await circulation.save()
            lastUpdatedBlock = blockHeight
            logger.debug(`Save circulation: ${circulation.amount.toString()}] at block ${blockHeight.toString()}`)
        }
    } catch(e) {
        logger.error(`Circulation error: ${e}`)
    }
}
