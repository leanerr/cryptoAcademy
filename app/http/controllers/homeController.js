const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Comment = require('app/models/comment');
const Article = require('app/models/article');
const Category = require('app/models/category');

class homeController extends controller {
    
    async index(req , res) {
        const courses = await Course.find({}).sort({ createdAt: 1 }).limit(3).exec();
        const articles = await Article.find({}).sort({ createdAt: 1 }).limit(3).exec();
        res.render('home/index', { courses, articles });
    
    }



    async articlePage(req, res, next) {
        const article = await Article.findOneAndUpdate({ slug: req.params.article }, { $inc : { viewCount : 1 }}).populate([{
            path : 'user',
            select : 'name'
        } , {
            path : 'comments',
            match : {
                check : true,
                parent : null
            },
            populate : [{
                path : 'user',
                select : 'name'
            }, {
                path : 'comments',
                match : {
                    check : true
                },populate : {
                    path : 'user',
                    select : 'name'
                }
            }]
        },

    
    ]).exec();

        const categories = await Category.find({parent : null}).populate('childs').exec();
        res.render('home/articlePage', { article, categories });
    }

    async features(req , res) {
        res.render('home/features');
    }
    async faq(req , res) {
        res.render('home/faq');
    }
    async chart(req , res) {
        res.render('home/chart', {});
    }
    async support(req , res) {
        res.render('home/contact');
    }
    async exchange(req , res) {
        res.render('home/exchange-one');
    }

    async comment(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let newComment = new Comment({
                user : req.user.id,
                ...req.body
            });

            await newComment.save();

            return this.back(req, res);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new homeController();