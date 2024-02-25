import fs from 'fs/promises';
import path from 'path';
export const createDirectory = async (directoryPath: string) => {
  try {
    await fs.access(directoryPath, fs.constants.F_OK);
    const stats = await fs.stat(directoryPath);
    if (stats.isDirectory()) return false;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(directoryPath, { recursive: true });
      return true;
    } else {
      console.log(error);
    }
  }

  return false;
};

export const isDirectoryPresent = async (directoryPath: string): Promise<boolean> => {
  try {
    await fs.access(directoryPath, fs.constants.F_OK);
    const stats = await fs.stat(directoryPath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
};

export const isFilePresent = async (filePath: string) => {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (error) {
    return false;
  }
};

export const copyFileToDirectory = async (sourceFile: string, destinationDirectory: string) => {
  try {
    const destinationPath = path.join(destinationDirectory, path.basename(sourceFile));

    if (await isFilePresent(destinationPath)) {
      console.log(`File already exists. Aborting copy operation...`);
    } else {
      await fs.copyFile(sourceFile, destinationPath);
      console.log(`File successfully copied from: ${sourceFile} to: ${destinationDirectory}`);
    }
  } catch (error) {
    console.log(`Error encountered while copying file...`);
    console.log(error);
  }
};

export const renameFile = async (oldFilePath: string, newFilePath: string): Promise<boolean> => {
  try {
    if (await isFilePresent(newFilePath)) {
      console.log(`Renamed file already exists. Aborting renaming operation...`);
    } else {
      await fs.rename(oldFilePath, newFilePath);
      console.log(`Successfully renamed file from: ${oldFilePath} to: ${newFilePath}`);
      return true;
    }
  } catch (error) {
    console.log(`Failed to rename file...`);
  }

  return false;
};

export const writeToFile = async (filePath: string, content: string) => {
  try {
    await fs.writeFile(filePath, content, { flag: 'a' });
    console.log(`Added content: ${content} - FilePath: ${filePath}`);
  } catch (error) {
    console.log(`Failed to write to file: ${filePath}`);
  }
};

export const overwriteFileContent = async (filePath: string, content: string) => {
  try {
    await fs.writeFile(filePath, content);
    console.log(`Added content: ${content} - FilePath: ${filePath}`);
  } catch (error) {
    console.log(`Failed to write to file: ${filePath}`);
  }
};

export const createFile = async (fileName: string, filePath: string) => {
  try {
    if (await isFilePresent(filePath + '/' + fileName)) {
      console.log(`File already exists. File Name: ${fileName} - File Path: ${filePath}`);
    } else {
      await fs.writeFile(filePath + '/' + fileName, '');
    }
  } catch (error) {
    console.log(`Error encountered while creating directory: ${error}`);
    console.log(error);
  }
};

export const deleteDirectory = async (directoryPath: string) => {
  try {
    if (await isDirectoryPresent(directoryPath)) {
      const files = await fs.readdir(directoryPath);

      for (const file of files) {
        const fullPath = path.join(directoryPath, file);

        if ((await fs.lstat(fullPath)).isDirectory()) {
          await deleteDirectory(fullPath);
        } else {
          await fs.unlink(fullPath);
        }
      }

      await fs.rmdir(directoryPath);
      console.log(`Successfully deleted directory: ${directoryPath}`);
    } else {
      console.log(`No such directory exists. Attempted to delete: ${directoryPath}`);
      console.log(`No such directory exists. Attempted to delete: ${directoryPath}`);
    }
  } catch (error) {
    console.log(`Error encountered while deleting directory: ${directoryPath}. Error: ${error}`);
    console.log(error);
  }
};
