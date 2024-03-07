import { D1Orm, DataTypes, Model } from 'd1-orm';
import { PostSchema } from '../types';

export default class PostDao {
    private postDao;

    constructor(orm: D1Orm) {
        this.postDao = new Model(
            {
              D1Orm: orm,
              tableName: "post",
              primaryKeys: "id"
            },
            {
              id: {
                type: DataTypes.STRING,
                notNull: true,
              },
              title: {
                type: DataTypes.STRING,
                notNull: true,
              },
              content: {
                type: DataTypes.STRING,
                notNull: true,
              },
              author: {
                type: DataTypes.STRING,
                notNull: true,
              },
              votes: {
                type: DataTypes.INT,
                notNull: true,
                defaultValue: 0,
              }
            }
          );
    }

    // TODO: need to send tx to eth
    async createPost(post: PostSchema): Promise<any> {
        return this.postDao.InsertOne(post);
    }

    // orderBy desc createdAt
    async getPosts(offset: number): Promise<any> {
        return this.postDao.All({
            limit: 10,
            offset: offset,
          });
    }

    async getPostsByCommitment(commitment: string, offset: number): Promise<any> {
        return this.postDao.All({
            where: {
                author: commitment,
            },
            offset: offset,
            limit: 10,
        });
    }

    async getPostById(id: string) {
        return this.postDao.First({
            where: {
                id: id,
            }
        });
    }

    async updateVotes(id: string, vote: number): Promise<any> {
        return this.postDao.Update({
            where: {
                id: id,
            },
            data: {
                votes: vote
            }
        })
    }
}