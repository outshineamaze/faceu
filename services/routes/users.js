var express = require('express');
var router = express.Router();

const {
  ProxyUrl,
  AppId,
  SecretId,
  SecretKey
} = require('../config/tecent_cloud.js');

const ImageClient = require('image-node-sdk')

// // 个体信息管理 - 个体创建
// let person1 = 'http://img1.gtimg.com/ent/pics/hv1/15/148/2141/139256280.jpg';
// let person2 = 'http://img1.gtimg.com/ent/pics/hv1/21/36/2041/132725226.jpg';
// let person3 = 'http://inews.gtimg.com/newsapp_match/0/2595266895/0';
// let person4 = 'http://img2.utuku.china.com/592x0/news/20170628/f583966c-e3f5-4244-bd72-bbeab6a0f720.jpg';



// // 个体信息管理 - 多脸检索
// let person5 = 'http://img1.gtimg.com/ent/pics/hv1/15/148/2141/139256280.jpg';
// let imgClient14 = new ImageClient({ AppId, SecretId, SecretKey });
// // imgClient14.setProxy(ProxyUrl)
// imgClient14.faceMultiple({
//   data: {
//     group_id: 'female-stars',
//     // group_ids: ['female-stars'],
//     url: person5,
//     // person_name: '迪丽热巴'
//   }
// }).then((result) => {
//   console.log(result.body);
// }).catch((e) => {
//   console.log(e);
// });

// // 个体信息管理 - 人脸验证
// let person6 = 'http://inews.gtimg.com/newsapp_match/0/2595266895/0';
// let imgClient15 = new ImageClient({ AppId, SecretId, SecretKey });
// // imgClient15.setProxy(ProxyUrl)
// imgClient15.faceVerify({
//   data: {
//     person_id: 'yangmi',
//     url: person6,
//   }
// }).then((result) => {
//   console.log(result.body);
// }).catch((e) => {
//   console.log(e);
// });

// // 个体信息管理 - 人脸检索
// let person7 = 'http://img1.utuku.china.com/640x0/news/20170530/f8a463d7-a032-4535-8fbb-0a6bfa7b06df.jpg';
// let imgClient16 = new ImageClient({ AppId, SecretId, SecretKey });
// // imgClient16.setProxy(ProxyUrl)
// imgClient16.faceIdentify({
//   data: {
//     group_id: 'female-stars',
//     url: person7,
//   }
// }).then((result) => {
//   console.log(result.body);
// }).catch((e) => {
//   console.log(e);
// });



var multer  = require('multer')
var upload = multer({ dest: 'upload/' });


function toBuffer(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

/* GET users listing. */
router.post('/new', upload.single('avatar'), function (req, res, next) {
  const { id, group_id, name, url } = req.query
  console.log(req.query)
  let imgClient13 = new ImageClient({ AppId, SecretId, SecretKey });
  imgClient13.faceNewPerson({
    headers: {'content-type': 'multipart/form-data'},
    data: {
      group_ids: ['female-stars'],
      person_id: 'yangmi',
      url: req.file,
      person_name: '杨幂'
    }
  }).then((result) => {
    res.json(result);
  }).catch((e) => {
    res.json(e);
  });
});

router.get('/new', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/addFace', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
