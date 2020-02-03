async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { description_contains: args.filter },
          { url_contains: args.filter }
        ]
      }
    : {};

  const posts = await context.prisma.posts({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  });
  const count = await context.prisma
    .postsConnection({
      where
    })
    .aggregate()
    .count();

  return {
    posts,
    count
  };
}

async function post(parent, args, ctx) {
  const post = await ctx.prisma.post({ id: args.id });
  return post;
}

function users(root, _, ctx) {
  return ctx.prisma.users();
}

function user(root, { id, email }, ctx) {
  return ctx.prisma.user({ id: id, email: email });
}

function votes(_, _, ctx) {
  const votes = ctx.prisma.votes();
  return votes
}

module.exports = {
  feed,
  post,
  users,
  user,
  votes
};
