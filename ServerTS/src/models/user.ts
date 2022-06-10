import mongoose, { Schema, Document }  from 'mongoose';
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  status: string;
  posts:  Schema.Types.ObjectId [];
}
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'I am new!'
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});
const User = mongoose.model('User', userSchema);
export default  User;
