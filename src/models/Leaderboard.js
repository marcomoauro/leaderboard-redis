import log from "../log.js";
import Cache from "../cache.js";
import User from "./User.js";

export class Leaderboard {
  #cache_key;

  constructor(name) {
    this.#cache_key = name;
  }

  static getScoreLeaderboard = () => {
    return new Leaderboard('leaderboard')
  }

  static getWinsLeaderboard = () => {
    return new Leaderboard('wins_leaderboard')
  }

  getByScore = async (limit) => {
    log.info('Model::Leaderboard::getByScore', { limit })

    const raw_leaderboard = await this.#getRawLeaderboard(limit);

    const leaderboard = [];
    this.#parseResult(raw_leaderboard, leaderboard);

    const user_ids = leaderboard.map((entry) => entry.user_id);
    const id_to_user_map = await this.#getUserMap(user_ids)

    this.#computeLeaderboardWithUserNames(leaderboard, id_to_user_map)

    return leaderboard
  }

  // get the raw leaderboard from the cache
  #getRawLeaderboard = async (limit) => {
    const raw_leaderboard = await Cache.getClient().zrevrange(this.#cache_key, 0, limit ? limit - 1 : -1, 'WITHSCORES');

    return raw_leaderboard
  }

  // parse the result into an array of objects
  #parseResult = (raw_leaderboard, leaderboard) => {
    for (let i = 0; i < raw_leaderboard.length; i += 2) {
      leaderboard.push({
        user_id: parseInt(raw_leaderboard[i]),
        score: parseInt(raw_leaderboard[i + 1])
      })
    }
  }

  // crete a map of user_id to user object
  #getUserMap = async (user_ids) => {
    const users = await User.list(user_ids);
    const id_to_user_map = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {})

    return id_to_user_map
  }

  // replace user_id with user name
  #computeLeaderboardWithUserNames = (leaderboard, id_to_user_map) => {
    leaderboard.forEach((entry, index) => {
      const user_id = entry.user_id

      leaderboard[index].user = id_to_user_map[user_id].name
      delete leaderboard[index].user_id
    })
  }

  incrementScore = async (user_id, increment) => {
    log.info('Model::Leaderboard::incrementScore', { user_id, increment })

    await Cache.getClient().zincrby(this.#cache_key, increment, user_id);
  }

  getTopUserIdByRank = async () => {
    log.info('Model::Leaderboard::getFirstUserKey')

    const [user_id] = await Cache.getClient().zrevrange(this.#cache_key, 0, 0, 'WITHSCORES');

    return parseInt(user_id)
  }

  reset = async () => {
    log.info('Model::Leaderboard::resetScore')

    await Cache.getClient().del(this.#cache_key);
  }

}