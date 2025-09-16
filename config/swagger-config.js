
const swaggerConfig = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'LastMetro API',
            version: '1.0.0',
            description: 'Ce mini-projet simule un service qui aide un usager a decider s\'il attrapera le **dernier metro** a Paris. Il sert de fil rouge pour introduire Express, Docker et Compose/Swagger.\n',
            contact: {
                name: 'Spokay',
            },
        },
    },
    apis: ['./routes/*.js'],
};

module.exports = { options: swaggerConfig };