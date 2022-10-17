import {RegistryTypes} from '@polkadot/types/types'

const khalaTypes: RegistryTypes = {
    ChainId: 'u8',
    BridgeChainId: 'u8',
    ResourceId: '[u8; 32]',
    DepositNonce: 'u64'
}

export default khalaTypes