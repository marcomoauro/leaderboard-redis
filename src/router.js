import Router from '@koa/router';
import {healthcheck} from "./api/healthcheck.js";
import {routeToFunction} from "./middlewares.js";
import {getLeaderboard, getWinsLeaderboard} from "./controllers/leaderboard.js";

const router = new Router();

router.get('/healthcheck', routeToFunction(healthcheck));

router.get('/leaderboard', routeToFunction(getLeaderboard));
router.get('/wins-leaderboard', routeToFunction(getWinsLeaderboard));

export default router;