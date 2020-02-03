function postedBy(parent, args, context) {
    return context.prisma.post({ id: parent.id }).postedBy()
  }
  
async function votes(parent, args, context) {
    const votes = await context.prisma.post({ id: parent.id }).votes()
    return votes
}

async function comments(parent, args, context) {
  const comments = await context.prisma.post({ id: parent.id }).comments()
  return comments
}

async function commentsCount(root, args, ctx) {
  const count = await ctx.prisma.commentsConnection({ where: { post: { id: root.id } } }).aggregate().count()
  return count
}

async function votesCount(root, args, ctx) {
  const count = await ctx.prisma.votesConnection({ where: { post: { id: root.id } } }).aggregate().count()
  return count;
} 

  module.exports = {
    postedBy,
    votes,
    comments,
    commentsCount,
    votesCount
  }