import express from 'express';
import { dockerStatus, startDockerProject } from '../controllers/docker';

const router = express.Router();

router.get('/api/docker/status', dockerStatus);
router.get('/api/docker/project-details');
router.post('/api/docker/start-project', startDockerProject);
router.post('/api/docker/stop-project');
router.get('/api/docker/project-startup-details');

export = router;
