import { IMT, IMTMerkleProof } from '@zk-kit/imt';

export default class IMTService {
    private imt: IMT;

    constructor(imt: IMT) {
        this.imt = imt;
    }

    insertLeaf(leaf: bigint) {
        this.imt.insert(leaf);
    }

    isLeafExist(leaf: bigint) {
        return this.imt.indexOf(leaf) != -1 ? true : false;
    }

    generateProof(leaf: bigint) {
        const index = this.imt.indexOf(leaf);
        return this.imt.createProof(index);
    }

    verifyProof(proof: IMTMerkleProof) {
        return this.imt.verifyProof(proof);
    }
}