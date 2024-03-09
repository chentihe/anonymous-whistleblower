import { UserAlreadySignedUpError } from '../types';
import { Contract } from 'ethers';
import IMTService from './IMTService';

export default class UserService {
    private contract: Contract;
    private imtService: IMTService;

    constructor(contract: Contract, imtService: IMTService) {
        this.contract = contract;
        this.imtService = imtService;
    }

    // don't save user's identity into db
    async signup(commitment: string): Promise<void> {
        const leaf = BigInt(commitment);

        if (this.imtService.isLeafExist(leaf)) {
            throw UserAlreadySignedUpError;
        }

        const tx = await this.contract.signup(leaf);
        await tx.wait();

        this.imtService.insertLeaf(leaf);
    }
}