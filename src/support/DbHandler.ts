import prisma from '../libs/db/prisma';

export class DbHandler {
  static async createDockerWordpressProject(projectConfig: any) {
    await prisma.dockerWordpressProject.create({
      data: {
        project_name: projectConfig.projectName,
        wordpress_version: projectConfig.wordpressVersion,
        mysql_version: projectConfig.mysqlVersion,
        mysql_database: projectConfig.mysqlDatabase,
        mysql_database_username: projectConfig.mysqlDatabaseUsername,
        mysql_database_password: projectConfig.mysqlDatabasePassword,
        mysql_database_root_password: projectConfig.mysqlDatabaseRootPassword,
        base_url: projectConfig.baseUrl,
        docker_mysql_port: projectConfig.dockerMysqlPort,
        docker_wordpress_port: projectConfig.dockerWordpressPort,
        wordpress_project_directory: projectConfig.wpInstanceDirectory
      }
    });
  }

  static async getDockerWordpressProjectList() {
    return await prisma.dockerWordpressProject.findMany();
  }
}
