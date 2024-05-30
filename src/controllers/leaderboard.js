import log from "../log.js";
import {Leaderboard} from "../models/Leaderboard.js";

export const getLeaderboard = async ({limit}) => {
  limit = parseInt(limit) || 10
  log.info('Controller::leaderboard::getLeaderboard', {limit})

  const leaderboard = Leaderboard.getScoreLeaderboard()
  const rank = await leaderboard.getByScore(limit)

  return { rank }
}

export const getWinsLeaderboard = async () => {
  log.info('Controller::leaderboard::getWinsLeaderboard')

  const leaderboard = Leaderboard.getWinsLeaderboard()
  const rank = await leaderboard.getByScore()

  return { rank }
}