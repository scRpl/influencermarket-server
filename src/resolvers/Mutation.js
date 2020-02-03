const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, ctx, info) {
  // 1
  if (args.password !== args.confirmedPassword) {
    throw new Error("Passwords do not match");
    return;
  }

  const password = await bcrypt.hash(args.password, 10);
  const confirmedPassword = await bcrypt.hash(args.confirmedPassword, 10);

  // 2
  const user = await ctx.prisma.createUser({
    ...args,
    password,
    confirmedPassword
  });

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4
  return {
    token,
    user
  };
}

async function login(parent, args, ctx, info) {
  // 1
  const user = await ctx.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3
  return {
    token,
    user
  };
}

async function removeAccount(root, args, ctx) {
  const user = await ctx.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }

  return ctx.prisma.deleteUser({
    email: args.email
  });
}

async function updateUser(root, args, ctx) {
  const userId = getUserId(ctx);

  if (userId !== args.id) {
    throw new Error("User not authorized to change data");
  }

  return ctx.prisma.updateUser({
    data: {
      bio: args.bio,
      website: args.website,
      location: args.location
    },
    where: {
      id: args.id
    }
  });
}

async function post(parent, args, ctx, info) {
  const userId = getUserId(ctx);
  return await ctx.prisma.createPost({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
}

async function updatePost(parent, args, ctx, info) {
  const userId = getUserId(ctx);
  const user = await ctx.prisma.post({ id: args.id }).postedBy();

  if (userId !== user.id) {
    throw new Error("User not authorized to update post");
  }

  return ctx.prisma.updatePost({
    data: {
      url: args.url,
      description: args.description
    },
    where: {
      id: args.id
    }
  });
}

async function deletePost(parent, args, ctx, info) {
  const userId = getUserId(ctx);
  const user = await ctx.prisma.post({ id: args.id }).postedBy();

  if (userId !== user.id) {
    throw new Error("User not authorized to delete post");
  }

  return ctx.prisma.deletePost({
    id: args.id
  });
}

async function vote(parent, args, ctx, info) {
  // 1
  const userId = getUserId(ctx);

  // 2
  const postExists = await ctx.prisma.$exists.vote({
    user: { id: userId },
    post: { id: args.postId }
  });
  if (postExists) {
    throw new Error(`Already voted for post: ${args.postId}`);
  }

  // 3
  return ctx.prisma.createVote({
    user: { connect: { id: userId } },
    post: { connect: { id: args.postId } }
  });
}

function comment(parent, args, ctx, info) {
  const userId = getUserId(ctx);

  return ctx.prisma.createComment({
    body: args.body,
    post: { connect: { id: args.postId } },
    writtenBy: { connect: { id: userId } }
  });
}

async function updateComment(root, args, ctx) {
  const userId = getUserId(ctx);

  const user = await ctx.prisma.comment({ id: args.id }).writtenBy();

  if (userId !== user.id) {
    throw new Error("User not authorized to update comment");
  }

  return ctx.prisma.updateComment({
    where: { id: args.id },
    data: {
      body: args.body
    }
  });
}

async function deleteComment(parent, args, ctx) {
  const userId = getUserId(ctx);
  const user = await ctx.prisma.comment({ id: args.id }).writtenBy();

  if (userId !== user.id) {
    throw new Error("User not authorized to delete comment");
  }

  return ctx.prisma.deleteComment({
    id: args.id
  });
}

async function like(parent, args, ctx, info) {
  const userId = getUserId(ctx);
  return ctx.prisma.createLike({
    user: { connect: { id: userId } },
    comment: { connect: { id: args.commentId } }
  });
}

module.exports = {
  signup,
  login,
  updateUser,
  post,
  updatePost,
  deletePost,
  vote,
  comment,
  updateComment,
  deleteComment,
  like,
  removeAccount
};
