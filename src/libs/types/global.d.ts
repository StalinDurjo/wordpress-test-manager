export interface WPInstanceConfig {
  project_name?: string | null;
  wordpress_version?: string | null;
  mysql_version?: string | null;
  mysql_database?: string | null;
  mysql_database_username?: string | null;
  mysql_database_password?: string | null;
  mysql_database_root_password?: string | null;
  docker_mysql_port?: string | null;
  docker_phpmyadmin_port?: string | null;
  docker_wordpress_port?: string | null;
  wordpress_project_directory?: string | null;
}
