import mongoose, { Schema, Document }  from 'mongoose';
export interface IPost extends Document {
  title: string;
  imageUrl: string;
  content: string;
  creator: Schema.Types.ObjectId;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);
const Post = mongoose.model('Post', postSchema);
export default Post;
