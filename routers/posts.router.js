import {Router} from 'express';
import { getAllPosts } from '../controllers/posts.controller.js';

const postRouter = Router()

postRouter.route('/').post(getAllPosts)

export default postRouter