import log from "../log.js";
import Cache from "../cache.js";
import User from "./User.js";

export class Leaderboard {
  static #cache_key = "leaderboard";

  static getByScore = async (limit) => {
    log.info('Model::Leaderboard::getByScore', { limit })

    const leaderboard = await this.computeLeaderboard(limit);

    return leaderboard
  }

  static computeLeaderboard = async (limit) => {
    log.info('Model::Leaderboard::computeLeaderboard', { limit })

    const raw_leaderboard = await this._getRawLeaderboard(limit);

    const leaderboard = [];
    this._parseResult(raw_leaderboard, leaderboard);

    const user_ids = leaderboard.map((entry) => entry.user_id);
    const id_to_user_map = await this._getUserMap(user_ids)

    this._computeLeaderboardWithUserNames(leaderboard, id_to_user_map)

    return leaderboard
  }

  // get the raw leaderboard from the cache
  static _getRawLeaderboard = async (limit) => {
    const raw_leaderboard = await Cache.getClient().zrevrange(this.#cache_key, 0, limit - 1, 'WITHSCORES');

    return raw_leaderboard
  }

  // parse the result into an array of objects
  static _parseResult = (raw_leaderboard, leaderboard) => {
    for (let i = 0; i < raw_leaderboard.length; i += 2) {
      leaderboard.push({
        user_id: parseInt(raw_leaderboard[i]),
        score: parseInt(raw_leaderboard[i + 1])
      })
    }
  }

  // crete a map of user_id to user object
  static _getUserMap = async (user_ids) => {
    const users = await User.list(user_ids);
    const id_to_user_map = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {})

    return id_to_user_map
  }

  // replace user_id with user name
  static _computeLeaderboardWithUserNames = (leaderboard, id_to_user_map) => {
    leaderboard.forEach((entry, index) => {
      const user_id = entry.user_id

      leaderboard[index].user = id_to_user_map[user_id].name
      delete leaderboard[index].user_id
    })
  }

  static incrementScore = async (user_id, increment) => {
    log.info('Model::Leaderboard::incrementScore', { user_id, increment })

    await Cache.getClient().zincrby(this.#cache_key, increment, user_id);
  }

  static reset = async () => {
    log.info('Model::Leaderboard::resetScore')

    await Cache.getClient().del(this.#cache_key);
  }

}