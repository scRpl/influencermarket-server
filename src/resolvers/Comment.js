function writtenBy(parent, args, context, info) {
    return context.prisma.comment({ id: parent.id }).writtenBy()
}

async function likes(parent, args, context, info) {
    const likes = await context.prisma.comment({ id: parent.id }).likes()
    return likes
}

function post(parent, args, context, info) {
    return context.prisma.comment({ id: parent.id }).post()
}

module.exports = {
    writtenBy,
    likes,
    post
}