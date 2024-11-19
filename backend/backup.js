import { exec } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

// Get the current directory name from the module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Backup function
const backupDatabase = () => {
    // Get MongoDB URL from environment variables
    const mongoUrl = process.env.MONGO_URL;

    // Define the backup output directory (you can customize this)
    const backupDir = path.join(__dirname, 'backups'); // Change to your desired path
    const timestamp = new Date().toISOString().replace(/:/g, '-'); // Create a timestamp for the backup filename
    const backupFile = path.join(backupDir, `backup-${timestamp}.gz`);

    // Create the backup command
    const command = `mongodump --uri="${mongoUrl}" --gzip --archive="${backupFile}"`;

    // Execute the backup command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error creating backup: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`Backup created successfully: ${backupFile}`);
    });
};
//cron
cron.schedule('0 12 * * *', () => {
    console.log('Starting scheduled backup...');
    backupDatabase();
});


