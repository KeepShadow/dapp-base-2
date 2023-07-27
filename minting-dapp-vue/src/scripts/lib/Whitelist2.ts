import whitelistAddresses from '../../../../smart-contract/config/whitelist2.json'
import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
/* import fs from 'fs'; */

class Whitelist {
  private merkleTree!: StandardMerkleTree<string[]>
  private containAddr!: boolean
  public mintAmountAllowed!: number

  private getMerkleTree (): StandardMerkleTree<string[]> {
    if (this.merkleTree === undefined) {
      const tree = StandardMerkleTree.of(whitelistAddresses, ['address', 'uint256'])
      this.merkleTree = tree
    }
    return this.merkleTree
  }

  public getProofForAddress (address: string): string[] {
    for (const [i, v] of this.getMerkleTree().entries()) {
      if (v[0] === address) {
        const proof = this.getMerkleTree().getProof(i)
        /* console.log(proof) */
        return proof
      }
    }
    return []
  }

  public getRawProofForAddress (address: string): string {
    return this.getProofForAddress(address).toString().replaceAll('\'', '').replaceAll(' ', '')
  }

  public contains (address: string): boolean {
    if (this.containAddr === undefined) {
      for (const [, v] of this.getMerkleTree().entries()) {
        if (v[0] === address) {
          this.containAddr = true
          this.mintAmountAllowed = Number(v[1])
          return this.containAddr
        }
      }
      this.containAddr = false
    }
    return this.containAddr
  }

  public getRoot () : string {
    this.getMerkleTree()
    return this.merkleTree.root
  }

  public getAmountAllowed (address: string) : number {
    if (this.mintAmountAllowed === undefined) {
      this.contains(address)
    }
    return this.mintAmountAllowed
  }
}

/* const x = new Whitelist;

x.getMerkleTree(); */

export default new Whitelist()
