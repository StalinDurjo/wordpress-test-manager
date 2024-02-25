import express from 'express';
import {
  addDockerWordpressProject,
  createProjectDirectory,
  createWordpressProjectSetupResource,
  createWpDirectory,
  deleteWpDirectory,
  getDockerWordpressProjectList
} from '../controllers/wordpress';

const router = express.Router();

router.post('/api/wordpress/create-wp-directory', createWpDirectory);
router.delete('/api/wordpress/delete-wp-directory', deleteWpDirectory);
router.post('/api/wordpress/create-project-directory', createProjectDirectory);
router.post('/api/wordpress/create-setup-resource', createWordpressProjectSetupResource);

router.post('/api/wordpress/configuration/add', addDockerWordpressProject);
router.get('/api/wordpress/configuration/get', getDockerWordpressProjectList);

export = router;
