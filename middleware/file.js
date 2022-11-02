const multer = require('multer');

// Fileni qayerga va qanday holatda saqlash
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, images);
  },
  filename(req, file, callback) {
    // File ni unique nom b-n saqlash uchun oldiga sanani qo'yiladi
    callback(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const filterFile = (req, file, callback) => {
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    // Agar filelar tegishli formatga ega bo'lmasa
    callback(null, false);
  }
};

module.exports = multer({
  storage,
  filterFile,
});
