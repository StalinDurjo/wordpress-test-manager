import path from 'path';

// The following directories exists inside the project
export const ROOT_DIR = path.resolve(process.cwd());
export const RESOURCE_DIR = `${ROOT_DIR}/resource`;
export const DOCKER_SETUP_RESOURCE_DIR = `${ROOT_DIR}/resource/docker-resource`;
export const PLUGINS_DIR = `${ROOT_DIR}/resource/plugins`;
export const THEMES_DIR = `${ROOT_DIR}/resource/themes`;

// The following directories doesn't exist before the application is executed
// These directories gets created during application runtime
export const OUT_DIR = `${ROOT_DIR}/out`;
export const WP_DIR = `${ROOT_DIR}/out/wp`;
