import log from "../log.js";
import {Leaderboard} from "../models/Leaderboard.js";

export const getLeaderboard = async ({limit}) => {
  limit = parseInt(limit) || 10
  log.info('Controller::leaderboard::getLeaderboard', {limit})

  const leaderboard = new Leaderboard('leaderboard')
  const rank = await leaderboard.getByScore(limit)

  return { rank }
}

export const getWinsLeaderboard = async () => {
  log.info('Controller::leaderboard::getWinsLeaderboard')

  const leaderboard = new Leaderboard('wins_leaderboard')
  const rank = await leaderboard.getByScore()

  return { rank }
}