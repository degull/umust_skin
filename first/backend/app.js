const express = require('express');
const multer = require('multer');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 파일 업로드 경로를 설정합니다. 필요에 따라 변경하세요.
    cb(null, './database/manseryuk.db');
  },
  filename: (req, file, cb) => {
    // 업로드된 파일의 이름을 설정합니다. 필요에 따라 변경하세요.
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// POST method route for file upload
app.post('./database/manseryuk.db', upload.single('file'), (req, res) => {
  // 파일이 업로드되면 실행될 코드를 여기에 추가합니다.
  // req.file에 업로드된 파일에 대한 정보가 포함됩니다.
  res.json({ message: '파일 업로드 성공' });
});

// 예시로 GET 엔드포인트 추가
app.get('/', (req, res) => {
  res.send('Express 서버가 정상 작동 중입니다.');
});

// 서버를 3000 포트에서 실행
app.listen(3000, () => {
  console.log('서버가 3000 포트에서 실행 중입니다.');
});
