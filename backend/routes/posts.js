const express = require('express');
const checkAuth =require('../middleware/check-auth');
const extractFiles = require('../middleware/file');
const router = express.Router();

const postsController = require('../controllers/post');

router.post('',checkAuth, extractFiles, postsController.createPost)
router.put('/:id', checkAuth, extractFiles, postsController.updatePost)
router.get('', postsController.getPosts)
router.get('/:id', postsController.getPost)
 router.delete('/:id',checkAuth, postsController.deletePost)

 module.exports = router;
