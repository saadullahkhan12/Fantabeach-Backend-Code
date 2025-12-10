const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminMiddleware = require('../middleware/adminMiddleware');

// Configure multer for CSV upload
const upload = multer({ storage: multer.memoryStorage() });

// Player Management Routes
const playerController = require('../controllers/admin/playerController');
router.post('/players', adminMiddleware, playerController.createPlayer);
router.get('/players', adminMiddleware, playerController.getAllPlayers);
router.get('/players/:id', adminMiddleware, playerController.getPlayer);
router.put('/players/:id', adminMiddleware, playerController.updatePlayer);
router.delete('/players/:id', adminMiddleware, playerController.deletePlayer);
router.post('/players/upload-csv', adminMiddleware, upload.single('file'), playerController.uploadPlayersCSV);
router.post('/players/:playerId/assign-competition', adminMiddleware, playerController.assignPlayerToCompetition);
router.delete('/players/:playerId/competitions/:competitionId', adminMiddleware, playerController.removePlayerFromCompetition);

// Season Management Routes
const seasonController = require('../controllers/admin/seasonController');
router.post('/seasons', adminMiddleware, seasonController.createSeason);
router.get('/seasons', adminMiddleware, seasonController.getAllSeasons);
router.get('/seasons/:id', adminMiddleware, seasonController.getSeason);
router.put('/seasons/:id', adminMiddleware, seasonController.updateSeason);
router.delete('/seasons/:id', adminMiddleware, seasonController.deleteSeason);

// Competition Management Routes
const competitionController = require('../controllers/admin/competitionController');
router.post('/competitions', adminMiddleware, competitionController.createCompetition);
router.get('/competitions', adminMiddleware, competitionController.getAllCompetitions);
router.get('/competitions/:id', adminMiddleware, competitionController.getCompetition);
router.put('/competitions/:id', adminMiddleware, competitionController.updateCompetition);
router.delete('/competitions/:id', adminMiddleware, competitionController.deleteCompetition);
router.post('/competitions/:id/matchweeks', adminMiddleware, competitionController.addMatchweek);
router.put('/competitions/:id/matchweeks/:weekNumber', adminMiddleware, competitionController.updateMatchweek);

// Pair Management Routes
const pairController = require('../controllers/admin/pairController');
router.post('/pairs', adminMiddleware, pairController.createPair);
router.post('/pairs/bulk', adminMiddleware, pairController.createBulkPairs);
router.get('/pairs', adminMiddleware, pairController.getAllPairs);
router.get('/pairs/:id', adminMiddleware, pairController.getPair);
router.put('/pairs/:id', adminMiddleware, pairController.updatePair);
router.delete('/pairs/:id', adminMiddleware, pairController.deletePair);

// Match Management Routes
const matchController = require('../controllers/admin/matchController');
router.post('/matches', adminMiddleware, matchController.createMatch);
router.get('/matches', adminMiddleware, matchController.getAllMatches);
router.get('/matches/:id', adminMiddleware, matchController.getMatch);
router.put('/matches/:id/results', adminMiddleware, matchController.updateMatchResults);
router.post('/matches/:id/recalculate', adminMiddleware, matchController.recalculateMatchPoints);
router.delete('/matches/:id', adminMiddleware, matchController.deleteMatch);

// Game Rules Routes
const gameRulesController = require('../controllers/admin/gameRulesController');
router.get('/game-rules', adminMiddleware, gameRulesController.getAllGameRules);
router.get('/game-rules/:competitionId', adminMiddleware, gameRulesController.getGameRules);
router.put('/game-rules/:competitionId', adminMiddleware, gameRulesController.updateGameRules);

// User Monitoring Routes
const userMonitoringController = require('../controllers/admin/userMonitoringController');
router.get('/users', adminMiddleware, userMonitoringController.getAllUsers);
router.get('/users/:id', adminMiddleware, userMonitoringController.getUserProfile);
router.get('/users/:id/fantasy-teams', adminMiddleware, userMonitoringController.getUserFantasyTeams);
router.get('/users/:userId/fantasy-teams/:teamId', adminMiddleware, userMonitoringController.getFantasyTeamDetails);
router.post('/users/:userId/fantasy-teams/:teamId/reset', adminMiddleware, userMonitoringController.resetFantasyTeam);
router.put('/users/:userId/fantasy-teams/:teamId/change-player', adminMiddleware, userMonitoringController.changePlayerInTeam);
router.put('/users/:id/block', adminMiddleware, userMonitoringController.blockUser);
router.get('/competitions/:competitionId/leaderboard', adminMiddleware, userMonitoringController.getLeaderboard);

// Price Management Routes
const priceController = require('../controllers/admin/priceController');
router.get('/prices', adminMiddleware, priceController.getAllPrices);
router.get('/prices/:playerId/history', adminMiddleware, priceController.getPriceHistory);
router.put('/prices/:playerId', adminMiddleware, priceController.updatePlayerPrice);
router.post('/prices/recalculate', adminMiddleware, priceController.recalculatePrices);
router.post('/prices/bulk-update', adminMiddleware, priceController.bulkUpdatePrices);

// Monitoring & Error Control Routes
const monitoringController = require('../controllers/admin/monitoringController');
router.get('/monitoring/squads', adminMiddleware, monitoringController.getAllSquads);
router.get('/monitoring/player-scores', adminMiddleware, monitoringController.getPlayerScores);
router.get('/monitoring/anomalies', adminMiddleware, monitoringController.detectAnomalies);
router.post('/monitoring/fix-errors', adminMiddleware, monitoringController.fixErrors);
router.get('/monitoring/dashboard', adminMiddleware, monitoringController.getDashboard);

// Private League Management Routes
const privateLeagueController = require('../controllers/admin/privateLeagueController');
router.get('/private-leagues', adminMiddleware, privateLeagueController.getAllPrivateLeagues);
router.get('/private-leagues/:id', adminMiddleware, privateLeagueController.getPrivateLeague);
router.get('/private-leagues/:id/participants', adminMiddleware, privateLeagueController.getLeagueParticipants);
router.put('/private-leagues/:id', adminMiddleware, privateLeagueController.updatePrivateLeague);
router.delete('/private-leagues/:id', adminMiddleware, privateLeagueController.deletePrivateLeague);
router.delete('/private-leagues/:leagueId/users/:userId', adminMiddleware, privateLeagueController.removeUserFromLeague);
router.put('/users/:userId/block-account', adminMiddleware, privateLeagueController.blockUserAccount);

module.exports = router;

