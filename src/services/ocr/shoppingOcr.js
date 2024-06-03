const T = require('tesseract.js');

//T.recognize('src/public/photos/IMG_20240531_230534.jpg', 'eng', { logger: e => console.log(e) })
//    .then(out => console.log(out.data.text))

T.recognize('src/public/photos/images.png', 'eng', { logger: e => console.log(e) })
    .then(out => console.log(out.data.text))


