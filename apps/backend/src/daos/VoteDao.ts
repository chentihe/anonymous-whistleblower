import { D1Orm, DataTypes, Model } from 'd1-orm';
import { VoteSchema } from '../types';

export default class VoteDao {
    private voteDao;

    constructor(orm: D1Orm) {
        this.voteDao = new Model(
            {
              D1Orm: orm,
              tableName: "vote",
              primaryKeys: "id",
              autoIncrement: "id",
            },
            {
              id: {
                type: DataTypes.INT,
                notNull: true,
              },
              postId: {
                type: DataTypes.STRING,
                notNull: true,
              },
              voter: {
                type: DataTypes.STRING,
                notNull: true,
              },
              voteResult: {
                type: DataTypes.INT,
                notNull: true,
              }
            }
          );
    }

    // TODO: need to send tx to eth
    async sendVote(newVote: VoteSchema): Promise<any> {
        const vote = await this.voteDao.First({
            where: {
                voter: newVote.voter,
                postId: newVote.postId,
            }
        })

        if (vote != null || vote != undefined) {
            throw new Error("the user is voted for the post");
        }

        return this.voteDao.InsertOne(newVote);
    }
}