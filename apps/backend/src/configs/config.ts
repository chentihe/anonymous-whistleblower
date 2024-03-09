import { jsonFileAliases } from "@tableland/node-helpers";
import { Database } from "@tableland/sdk";
import { D1Orm } from "d1-orm";
import { ethers } from "ethers";
import AnonymousWhistlerArtifact from "../../../contracts/artifacts/contracts/Feedback.sol/Feedback.json";
import { fetchMerkleTree } from "./userMerkleTree";
import PostDao from "../daos/PostDao";
import VoteDao from "../daos/VoteDao";
import IMTService from "../services/IMTService";
import PostService from "../services/PostService";
import VoteService from "../services/VoteService";
import UserService from "../services/UserService";

const initialDb = async (db: Database) => {
    await db.prepare(`CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      votes INTEGER DEFAULT 0,
    );`).run();
  
    await db.prepare(`CREATE TABLE IF NOT EXISTS votes (
      postId TEXT PRIMARY KEY,
      voter TEXT NOT NULL,
      result TEXT NOT NULL,
    );`).run();
  }
  
export const loadConfig = async () => {
    const pk = process.env.PRIVATE_KEY;
    if (pk == undefined) {
      throw new Error("private key is not set");
    }
  
    const nodeUrl = process.env.NODE_URL;
    if (nodeUrl == undefined) {
      throw new Error("node url is not set");
    }
  
    const anonymousWhistlerAddress = process.env.ANONYMOUS_WHISTLER_ADDRESS;
    if (anonymousWhistlerAddress == undefined) {
      throw new Error("anonymous whistler address is not set");
    }
  
    const provider = new ethers.providers.JsonRpcProvider(nodeUrl);
  
    const signer = new ethers.Wallet(pk, provider);
    const contract = new ethers.Contract(anonymousWhistlerAddress, AnonymousWhistlerArtifact.abi, signer);
    
    const db = new Database({ signer, aliases: jsonFileAliases("./tableland.aliases.json") });
    const orm = new D1Orm(db);
    await initialDb(db);
  
    const postDao = new PostDao(orm);
    const voteDao = new VoteDao(orm);
    const imt = await fetchMerkleTree(contract);
  
    const imtService = new IMTService(imt);
    const postService = new PostService(postDao, contract, imtService);
    const voteService = new VoteService(postDao, voteDao, contract, imtService);
    const userService = new UserService(contract, imtService);

    return {
      postService: postService,
      voteService: voteService,
      userService: userService,
      imtService: imtService,
    };
  }