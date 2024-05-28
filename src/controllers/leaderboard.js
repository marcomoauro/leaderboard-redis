import log from "../log.js";
import {Leaderboard} from "../models/Leaderboard.js";

export const getLeaderboard = async ({limit}) => {
  limit = parseInt(limit) || 10
  log.info('Controller::leaderboard::getLeaderboard', {limit})

  const leaderboard = await Leaderboard.getByScore(limit)

  return { leaderboard }
}