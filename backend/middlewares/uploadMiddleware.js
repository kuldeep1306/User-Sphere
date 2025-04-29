const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedtYpes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedtYpes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false );


    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;    