import express from 'express';

const router = express.Router();

router.get('/api/docker/status');
router.get('/api/docker/project-details');
router.post('/api/docker/start-project');
router.post('/api/docker/stop-project');

export = router;
