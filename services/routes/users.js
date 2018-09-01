var express = require('express');
var router = express.Router();
const fs = require('fs')

const {
  ProxyUrl,
  AppId,
  SecretId,
  SecretKey
} = require('../config/tecent_cloud.js');



const { ImageClient } = require('image-node-sdk')

const PERSON_CACHE = {}


var multer  = require('multer')

//获取时间
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate.toString();
}
var datatime = 'upload/'+getNowFormatDate();
//将图片放到服务器
var storage = multer.diskStorage({
    // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
    destination: datatime,
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        cb(null,  Date.now() + '_' + file.originalname);
     }
}); 
var upload = multer({
    storage: storage
});

var memStorage = multer.memoryStorage()
var memUpload = multer({ storage: memStorage })


router.post("/upload_img", upload.single('avatar'), function(req, res){
  res.json(req.file)
})

let imgClient = new ImageClient({ AppId, SecretId, SecretKey });


const getPersonInfoFromCache = (person_id) => {
  if (PERSON_CACHE[person_id]) {
    return Promise.resolve(PERSON_CACHE[person_id])
  } else {
    return imgClient.faceGetInfo({
      data: {
        "person_id": person_id
      }
    })
  }
  
}

router.post('/new', function (req, res, next) {
  const { id, name, image_path } = req.body
  const data = {
    'group_ids[0]': "test_person",
    person_id: id,
    image :fs.createReadStream(image_path),
    person_name: name
  }


  imgClient.faceNewPerson({
    headers: {'content-type': 'multipart/form-data'},
    formData: data,
  }).then((result) => {
    console.log(result.body)
    res.send(result.body);
  }).catch((e) => {
    console.log(e)
    res.json(e);
  });
});




router.get('/getpersonids', function (req, res, next) {
  imgClient.faceGetPersonIds({
    data: {
      "group_id": "test_person"
    }
  }).then((result) => {
    console.log('result:',result.body)
    const reusltBody = JSON.parse(result.body)
    const personList =reusltBody.data.person_ids || []
    if (Array.isArray(personList)) {
      const personInfoListPromises = personList.map((item) => {

        return  getPersonInfoFromCache(item)
      })
      Promise.all(personInfoListPromises).then((results) => {
        const persionInfoList = results.map(item => {
          const jsonBody = JSON.parse(item.body)
          PERSON_CACHE[jsonBody.data.person_id] = item
          return jsonBody.data
        }
        )
        res.json({
          ret: 0, 
          data: persionInfoList
        });
      })
    }
    
  }).catch((e) => {
    console.log(e)
    res.json(e);
  });
  
});

router.get('/getinfo', function (req, res, next) {
  const { person_id } = req.query
  imgClient.faceGetInfo({
    data: {
      "person_id": person_id
    }
  }).then((result) => {
    console.log(result.body)
    res.send(result.body);
  }).catch((e) => {
    console.log(e)
    res.json(e);
  });
  
});


router.post('/search', memUpload.single('avatar'), function (req, res, next) {

  const filesBuffer = req.file.buffer
  console.log(typeof filesBuffer)
  const data = {
    'group_id': "test_person",
    'image':  filesBuffer
  }
  imgClient.faceIdentify({
    headers: {'content-type': 'multipart/form-data'},
    formData: data,
  }).then((result) => {
    console.log(result.body)
    res.send(result.body);
  }).catch((e) => {
    console.log(e)
    res.json(e);
  });
});

module.exports = router;

