import { task, types } from "hardhat/config"

task("deploy", "Deploy a Feedback contract")
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers, run }) => {

        const PoseidonT3Factory = await ethers.getContractFactory("PoseidonT3");
        const poseidonT3Contract = await PoseidonT3Factory.deploy();
        const poseidonT3Address = await poseidonT3Contract.getAddress();

        const AnonymousWhistleblowerFactory = await ethers.getContractFactory("AnonymousWhistleblower", {
            libraries: {
                PoseidonT3: poseidonT3Address,
            }
        })
        // depth 16
        const anonymousWhistleblowerContract = await AnonymousWhistleblowerFactory.deploy(16)

        if (logs) {
            console.info(`AnonymousWhistleblower contract has been deployed to: ${await anonymousWhistleblowerContract.getAddress()}`)
        }

        return anonymousWhistleblowerContract
    })
