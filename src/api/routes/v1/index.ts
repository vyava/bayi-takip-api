export {};
import * as express from 'express';
const bayilerRoutes = require('./bayiler.route');
// import {} from "./user.route";
// const authRoutes = require('./auth.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
// router.use('/docs', express.static('docs'));

router.use('/bayiler', bayilerRoutes);
// router.use('/auth', authRoutes);

module.exports = router;
