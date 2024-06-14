import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';

const zipUploadsDirectory = async () => {
  try {
    const uploadsDir = FileSystem.documentDirectory + 'uploads/';
    const zipFilePath = FileSystem.documentDirectory + 'uploads.zip';

    // Verificar si la carpeta de uploads existe
    const uploadsDirInfo = await FileSystem.getInfoAsync(uploadsDir);
    if (!uploadsDirInfo.exists) {
        console.log("NO EXIST CAEPTA");
      throw new Error(`La carpeta ${uploadsDir} no existe`);
    }

    // Comprimir la carpeta 'uploads'
    const result = await zip(uploadsDir, zipFilePath);
    
    console.log('Carpeta comprimida con éxito en:', result);
    return result;
  } catch (error) {
    console.error('Error al comprimir la carpeta:', error);
    throw error;
  }
};

const downloadZipFile = async () => {
  try {
    const zipFilePath = await zipUploadsDirectory();

    // Verificar si el dispositivo puede compartir archivos
    if (await Sharing.isAvailableAsync()) {
      // Compartir el archivo zip
      await Sharing.shareAsync(zipFilePath);
    } else {
      alert('Compartir no está disponible en este dispositivo');
    }
  } catch (error) {
    console.error('Error al descargar el archivo zip:', error);
  }
};

export { zipUploadsDirectory, downloadZipFile };
