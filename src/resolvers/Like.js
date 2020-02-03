async function comment(parent, args, context) {
    const comment = await context.prisma.like({ id: parent.id }).comment()
    return comment
  }
  
async  function user(parent, args, context) {
    const user = await context.prisma.like({ id: parent.id }).user()
    return user
  }
  
  module.exports = {
    comment,
    user,
  }