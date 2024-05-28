import Router from '@koa/router';
import {healthcheck} from "./api/healthcheck.js";
import {routeToFunction} from "./middlewares.js";

const router = new Router();

router.get('/healthcheck', routeToFunction(healthcheck));

export default router;