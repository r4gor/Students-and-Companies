import fs from 'fs';
import path from 'path';

export const saveBase64ToFile = (base64String: string, fileName: string): void => {

    const outputDirectory = "models/cv_files/";

    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }

    let filePath = path.join(outputDirectory, fileName + '.pdf');

    try {
        // Remove the Base64 metadata if present
        const base64Content = base64String.includes(',')
            ? base64String.split(',')[1]
            : base64String;

        // Decode the Base64 string into a binary buffer
        const fileBuffer = Buffer.from(base64Content, 'base64');

        // Write the buffer to the specified file
        fs.writeFileSync(filePath, fileBuffer);

        console.log(`File saved to ${filePath}`);
    } catch (error) {
        console.error('Error saving file:', error);
    }
};
