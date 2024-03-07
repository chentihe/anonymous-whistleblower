import { IMT } from "@zk-kit/imt";
import { Contract } from "ethers";
import { poseidon2 } from "poseidon-lite";
import IMTService from "../services/IMTService";

const zero = "19217088683336594659449020493828377907203207941212636669271704950158751593251";

export const fetchMerkleTree = async (contract: Contract) => {
    const data = await contract.data();

    const imt = new IMT(poseidon2, data.depth, zero, 2);
    
    const filter = contract.filters.Signup(null);
    const query = await contract.queryFilter(filter);   
    query.forEach((event) => {
        if (event.args != undefined) {
            const identity = event.args.identity;
            imt.insert(identity);
        }
    });

    return imt;
}

export const listenSignup = async (contract: Contract, imtService: IMTService) => {
    contract.on("Signup", (identity, event) => {
        imtService.insertLeaf(identity);
    });
}