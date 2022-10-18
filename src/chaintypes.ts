import type {RegistryTypes, OverrideBundleDefinition} from '@polkadot/types/types'
import { versionedKhala } from "@phala/typedefs";

// const khalaTypes: RegistryTypes = {
//     ChainId: 'u8',
//     BridgeChainId: 'u8',
//     ResourceId: '[u8; 32]',
//     DepositNonce: 'u64'
// }

export default {
  typesBundle: { ...versionedKhala } as OverrideBundleDefinition,
};