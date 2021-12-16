const withTM = require("next-transpile-modules")(["gsap"]);
module.exports = withTM({
    images: {
        domains: ['maniagosafaris.com'],
    },
    // distDir: 'build',
})