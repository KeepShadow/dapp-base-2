import whitelistAddresses from '../../../../smart-contract/config/whitelist.json'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'

class Whitelist {
  private merkleTree!: MerkleTree

  private getMerkleTree (): MerkleTree {
    if (this.merkleTree === undefined) {
      const leafNodes = whitelistAddresses.map((addr: string) => keccak256(addr))
      this.merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
    }

    return this.merkleTree
  }

  public getProofForAddress (address: string): string[] {
    return this.getMerkleTree().getHexProof(keccak256(address))
  }

  public getRawProofForAddress (address: string): string {
    return this.getProofForAddress(address).toString().replaceAll('\'', '').replaceAll(' ', '')
  }

  public contains (address: string): boolean {
    return this.getMerkleTree().getLeafIndex(Buffer.from(keccak256(address))) >= 0
  }
}

export default new Whitelist()
