import log from '../src/log.js'
import User from "../src/models/User.js";
import {Leaderboard} from "../src/models/Leaderboard.js";

const main = async () => {
  log.info('Start updating leaderboard scores')

  const daily_leaderboard = Leaderboard.getScoreLeaderboard()

  if (isScoreResetTime()) {
    const wins_leaderboard = Leaderboard.getWinsLeaderboard()

    const top_user_id = await daily_leaderboard.getTopUserIdByRank()
    await wins_leaderboard.incrementScore(top_user_id, 1)

    await daily_leaderboard.reset()
  }

  const users = await User.list()
  await incrementUsersScore(daily_leaderboard, users)

  process.exit(0)
}

const isScoreResetTime = () => {
  const actual_hour = new Date().getHours()
  return actual_hour === 0
}

const incrementUsersScore = async (daily_leaderboard, users) => {
  for (const user of users) {
    const score = computeRandomScore()
    await daily_leaderboard.incrementScore(user.id, score)
  }
}

// Returns a random score between 1 and 10
const computeRandomScore = () => {
  const score = Math.floor(Math.random() * 10) + 1

  return score
}

main()