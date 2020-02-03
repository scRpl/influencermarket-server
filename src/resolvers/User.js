function posts(parent, args, context) {
    const userPosts = context.prisma.user({ id: parent.id }).posts()
    const postCount = context.prisma.postsConnection().aggregate().count()
    return userPosts, postCount
  }

function votes(parent, args, context, info) {
    return context.prisma.user({ id: parent.id }).votes()
}

function comments(parent, args, context, info) {
    return context.prisma.user({ id: parent.id }).comments()
}
  
  module.exports = {
    posts,
    votes,
    comments
  }