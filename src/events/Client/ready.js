module.exports = {
    event: 'ready',
    once: true,
    run: (_, client) => {
        console.log('Successfully logged in as: %s', client.user.tag);
    }
}