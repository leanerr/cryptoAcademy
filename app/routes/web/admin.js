const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controllers/admin/adminController');
const courseController = require('app/http/controllers/admin/courseController');
const episodeController = require('app/http/controllers/admin/episodeController');
const commentController = require('app/http/controllers/admin/commentController');
const categoryController = require('app/http/controllers/admin/categoryController');
const userController = require('app/http/controllers/admin/userController');
const articleController = require('app/http/controllers/articleController');

// validators 
const courseValidator = require('app/http/validators/courseValidator');
const episodeValidator = require('app/http/validators/episodeValidator');
const categoryValidator = require('app/http/validators/categoryValidator');
const registerValidator = require('app/http/validators/registerValidator');
const articleValidator = require('app/http/validators/articleValidator');


// Helpers
const upload = require('app/helpers/uploadImage');

// Middlewares
const convertFileToField = require('app/http/middleware/convertFileToField')

router.use((req , res , next) => {
    res.locals.layout = "admin/master";
    next();
})

// Admin Routes
router.get('/' , adminController.index);

// Course Routes
router.get('/courses' , courseController.index);
router.get('/courses/create' , courseController.create);
router.post('/courses/create' ,
    upload.single('images') ,
    convertFileToField.handle ,
    courseValidator.handle() ,
    courseController.store
);
router.get('/courses/:id/edit' , courseController.edit);
router.put('/courses/:id' ,
    upload.single('images') ,
    convertFileToField.handle ,
    courseValidator.handle() ,    
    courseController.update
);
router.delete('/courses/:id' , courseController.destroy);


router.get('/users' , userController.index);
router.get('/users/create' , userController.create);
router.post('/users' , registerValidator.handle() , userController.store);
router.delete('/users/:id' , userController.destroy);
router.get('/users/:id/toggleadmin' , userController.toggleadmin);

// Episode Routes
router.get('/episodes' , episodeController.index);
router.get('/episodes/create' , episodeController.create);
router.post('/episodes/create' , episodeValidator.handle() , episodeController.store );
router.get('/episodes/:id/edit' , episodeController.edit);
router.put('/episodes/:id' , episodeValidator.handle() , episodeController.update );
router.delete('/episodes/:id' , episodeController.destroy);


// article
router.get('/', adminController.index);
router.get('/article', articleController.index);
router.get('/article/create', articleController.create);
router.post('/article/create', upload.single('images'), convertFileToField.handle, articleValidator.handle(), articleController.store);
// delete article
router.delete('/article/:id', articleController.destroy);
//edit article
router.get('/article/:id/edit', articleController.edit);
router.put('/article/:id', upload.single('images'), convertFileToField.handle, articleValidator.handle(), articleController.update);


// Category Routes
router.get('/categories' , categoryController.index);
router.get('/categories/create' , categoryController.create);
router.post('/categories/create' , categoryValidator.handle() , categoryController.store );
router.get('/categories/:id/edit' , categoryController.edit);
router.put('/categories/:id' , categoryValidator.handle() , categoryController.update );
router.delete('/categories/:id' , categoryController.destroy);

router.get('/comments/approved' , commentController.approved);
router.get('/comments' , commentController.index);
router.put('/comments/:id/approved' , commentController.update );
router.delete('/comments/:id' , commentController.destroy);

router.post('/upload-image' , upload.single('upload') , adminController.uploadImage);
module.exports = router;