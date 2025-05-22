const multer = require('multer');
const fs = require('fs');
const path = require('path');

class FileStorage {
    constructor(folderPath) {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, folderPath);
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            }
        });
        this.folderPath = folderPath;
        this.upload = multer({ storage: storage });
    }

    saveFile(key) {
        return this.upload.single(key);
    }

    async deleteFile(filename){
        const filePath = path.join(this.folderPath, filename);

        fs.unlink(filePath, (err) => {
            if (err){
                console.log("Error", err.message);
                return;
            }
            else {
                console.log("File " + filename + " deleted");
            }
        });
    }
}

module.exports = FileStorage;