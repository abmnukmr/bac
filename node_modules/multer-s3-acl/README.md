# multer-s3-acl
Streaming multer storage engine for AWS S3

This project is mostly an integration piece for existing code samples from Multer's [storage engine documentation](https://github.com/expressjs/multer/blob/master/StorageEngine.md) with [s3fs](https://github.com/RiptideElements/s3fs) as the substitution piece for file system.  Existing solutions found at the time of development required buffering the multipart uploads into the actual filesystem which is difficult to scale. This forked version of multer-s3 adds an option to optionally set ACL's. If ACL not specified, then default is to store the file with ACL: 'private'

# Install
```
npm install --save multer-s3-acl
```

# Tests
Tested with [s3rver](https://github.com/jamhall/s3rver) instead of your actual s3 credentials.  Doesn't require a real account or changing of hosts files.  Includes integration tests ensuring that it should work with express + multer.

```
npm test
```

# Usage
```
var express = require('express');
var app = express();
var multer = require('multer');
var s3 = require('multer-s3');

var upload = multer({
  storage: s3({
    bucket: 'some-bucket',
    secretAccessKey: 'some secret',
    accessKeyId: 'some key',
    region: 'us-east-1',
    ACL: 'some-acl',
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

app.post('/upload', upload.array('photos', 3), function(req, res, next){
  res.send('Successfully uploaded!');
});
```

# ACL options

AWS supports the following [options](http://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectPOST.html):

ACL: private | public-read | public-read-write | aws-exec-read | authenticated-read | bucket-owner-read | bucket-owner-full-control 
