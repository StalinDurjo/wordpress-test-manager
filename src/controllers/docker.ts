import { Request, Response, NextFunction } from 'express';
import { isDockerRunning } from '../libs/docker/docker';
import { DbHandler } from '../support/DbHandler';
import { isDirectoryPresent } from '../libs/file/fileUtils';
import { execCommand } from '../libs/cmd/cmdUtils';
import { subscriber } from '../subscribers/subscriber';
import SubscriberType from '../constants/SubscriberType';

export const dockerStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dockerStatus = isDockerRunning();
    return res.status(200).send({ message: 'Success', is_docker_running: dockerStatus });
  } catch (error) {
    return res.status(400).send({ message: 'Something went wrong!' });
  }
};

export const startDockerProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const configList = await DbHandler.getDockerWordpressProjectList();

    let counter = 0;
    for (const config of configList) {
      counter++;
      if (await isDirectoryPresent(config.wordpress_project_directory as string)) {
        subscriber.publish(SubscriberType.SAVE_LOCAL_TEST_URL, {
          name: 'base_url' + counter,
          url: config.base_url
        });

        await execCommand(`bash ./out/wp/${config.project_name}-start.sh`, './');

        console.log(config.project_name);
      }
    }

    return res.status(200).send({
      message: 'Process executed successfully. Note: if Wordpress project directory is not created, this process will have no effect.'
    });
  } catch (error) {
    return res.status(400).send({ message: 'Something went wrong!', data: error });
  }
};
