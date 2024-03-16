import { task, types } from "hardhat/config"

task("deploy", "Deploy a Feedback contract")
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers, run }) => {

        const AnonymousWhistleblowerFactory = await ethers.getContractFactory("AnonymousWhistleblower")
        // depth 16
        const anonymousWhistleblowerContract = await AnonymousWhistleblowerFactory.deploy(16)

        if (logs) {
            console.info(`AnonymousWhistleblower contract has been deployed to: ${await anonymousWhistleblowerContract.getAddress()}`)
        }

        return anonymousWhistleblowerContract
    })
