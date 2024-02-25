import { Request, Response, NextFunction } from 'express';
import { createDirectorySync, isDirectoryPresentSync } from '../libs/file/fileUtilsSync';
import { DOCKER_SETUP_RESOURCE_DIR, WP_DIR } from '../config/directory';
import { copyFileToDirectory, createDirectory, createFile, deleteDirectory, isDirectoryPresent, isFilePresent, overwriteFileContent, writeToFile } from '../libs/file/fileUtils';
import { DbHandler } from '../support/DbHandler';
import { WPInstanceConfig } from '../libs/types/global';

export const createWpDirectory = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isDirectoryPresentSync(WP_DIR)) {
      return res.status(200).send({ message: `WordPress directory is already created.` });
    }

    const isDirectoryCreated = createDirectorySync(WP_DIR);

    if (isDirectoryCreated) {
      return res.status(200).send({ message: `WordPress Directory Created!` });
    } else {
      return res.status(400).send({ message: `Failed to create wp directory! Check if 'out' directory is created.` });
    }
  } catch (error) {
    return res.status(400).send({ message: 'Something went wrong!' });
  }
};

export const deleteWpDirectory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await isDirectoryPresent(WP_DIR))) {
      return res.status(400).send({ message: `WordPress directory is not present!` });
    }

    await deleteDirectory(WP_DIR);
    return res.status(200).send({ message: `WordPress Directory Deleted!` });
  } catch (error) {
    return res.status(400).send({ message: `Something Went Wrong!` });
  }
};

export const getDockerWordpressProjectList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectList = await DbHandler.getDockerWordpressProjectList();

    return res.status(200).send({ message: `Success.`, data: projectList });
  } catch (error) {
    return res.status(400).send({ message: `Something went wrong!` });
  }
};

export const addDockerWordpressProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqBody = await req.body;

    const existingProjectNameList = (await DbHandler.getDockerWordpressProjectList()).map((project) => {
      return project.project_name;
    });

    const projectNames = [];

    for (const data of reqBody) {
      if (existingProjectNameList.includes(data.project_name)) {
        projectNames.push(data.project_name);
      }
    }

    if (projectNames.length > 0) {
      return res.status(400).send({ message: `The following project(s) already exists: [${projectNames}]` });
    }

    for (const data of reqBody) {
      await DbHandler.createDockerWordpressProject({
        projectName: data.project_name,
        wordpressVersion: data.wordpress_version,
        mysqlVersion: data.mysql_version,
        mysqlDatabase: 'wordpress',
        mysqlDatabaseUsername: 'wp_user',
        mysqlDatabasePassword: 'wp_password',
        mysqlDatabaseRootPassword: 'MYSQL_ROOT_PASSWORD',
        baseUrl: `http://localhost:${data.docker_wordpress_port}:80`,
        dockerMysqlPort: data.docker_mysql_port,
        dockerWordpressPort: data.docker_wordpress_port,
        wpInstanceDirectory: `${WP_DIR}/${data.project_name}`
      });
    }

    return res.status(200).send({ message: `Wordpress project(s) successfully added to DB.` });
  } catch (error) {
    return res.status(400).send({ message: `Something went wrong!` });
  }
};

export const createProjectDirectory = async (req: Request, res: Response, next: NextFunction) => {
  if (await isDirectoryPresent(WP_DIR)) {
    const configList = await DbHandler.getDockerWordpressProjectList();

    try {
      const createdDirectoryList = [];
      for (const config of configList) {
        const wordpressProjectDirectory = config.wordpress_project_directory as string;

        // create wordpress instance directory if not created
        if (!(await isDirectoryPresent(wordpressProjectDirectory))) {
          await createDirectory(wordpressProjectDirectory);
        }

        if (await isDirectoryPresent(wordpressProjectDirectory)) {
          createdDirectoryList.push(wordpressProjectDirectory);
        }
      }

      return res.status(200).send({
        message: `Request Successful!`,
        created_directory_list: createdDirectoryList
      });
    } catch (error) {
      return res.status(400).send({ error: error });
    }
  } else {
    return res.status(400).send({ message: `Wordpress directory must be created first!` });
  }
};

const createDockerResource = async (config: WPInstanceConfig) => {
  const wpProjectDirectory = config.wordpress_project_directory as string;
  const dockerComposeFile = `${DOCKER_SETUP_RESOURCE_DIR}/docker-compose.yml`;
  const destinationDirectory = `${WP_DIR}/${config.project_name}`;

  if (await isDirectoryPresent(wpProjectDirectory)) {
    await copyFileToDirectory(dockerComposeFile, destinationDirectory);
    await createFile('.env', destinationDirectory);
  }
};

const writeToEnvFile = async (config: WPInstanceConfig) => {
  const envFilePath = `${WP_DIR}/${config.project_name}/.env`;

  if (await isFilePresent(envFilePath)) {
    await overwriteFileContent(envFilePath, '');
    await writeToFile(envFilePath, `WORDPRESS_VERSION=${config.wordpress_version}\n`);
    await writeToFile(envFilePath, `MYSQL_VERSION=${config.mysql_version}\n`);
    await writeToFile(envFilePath, `MYSQL_DATABASE=${config.mysql_database}\n`);
    await writeToFile(envFilePath, `MYSQL_USER=${config.mysql_database_username}\n`);
    await writeToFile(envFilePath, `MYSQL_PASSWORD=${config.mysql_database_password}\n`);
    await writeToFile(envFilePath, `MYSQL_ROOT_PASSWORD=${config.mysql_database_root_password}\n`);
    await writeToFile(envFilePath, `DB_PORT=${config.docker_mysql_port}\n`);
    await writeToFile(envFilePath, `WORDPRESS_PORT=${config.docker_wordpress_port}\n`);
  } else {
    console.log(`Aborting env config write operation. File is not present.`);
  }
};

const createDockerShellScript = async (config: WPInstanceConfig) => {
  const wpInstanceDirectory = config.wordpress_project_directory as string;
  if (await isDirectoryPresent(wpInstanceDirectory)) {
    const startFile = `${WP_DIR}/${config.project_name}-start.sh`;
    const stopFile = `${WP_DIR}/${config.project_name}-stop.sh`;

    if (!(await isFilePresent(startFile))) {
      await createFile(config.project_name + '-start.sh', `${WP_DIR}`);
      await writeToFile(startFile, `cd ./out/wp/${config.project_name}\n`);
      await writeToFile(startFile, `docker-compose up`);
    }

    if (!(await isFilePresent(stopFile))) {
      await createFile(config.project_name + '-stop.sh', `${WP_DIR}`);
      await writeToFile(stopFile, `cd ./out/wp/${config.project_name}\n`);
      await writeToFile(stopFile, `docker-compose down`);
    }
  }
};

export const createWordpressProjectSetupResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO:: check if all required resources are available before starting the resource creation process
    const configList = await DbHandler.getDockerWordpressProjectList();

    for (const config of configList) {
      await createDockerResource(config);
      await writeToEnvFile(config);
      await createDockerShellScript(config);
    }

    return res.status(200).send({
      message: `Request executed successfylly. Make sure WordPress instance(s) are already created, otherwise this request will have no effect.`
    });
  } catch (error) {
    return res.status(400).send({
      message: `Something went wrong!`
    });
  }
};
