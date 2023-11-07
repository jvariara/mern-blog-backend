import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, requird: true },
    caption: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    body: { type: Object, required: true },
    photo: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String] },
    categories: [{ type: Schema.Types.ObjectId, ref: "PostCategories" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

// Setting up a relation between post and comment
// Comments reference to post via the id of the post
PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

const Post = model("Post", PostSchema);
export default Post;
