// Static product catalog — shown when CockroachDB has no data yet
// or merged alongside live products from the database.
// Images sourced from Pexels (no referrer restrictions, always loads)

export const staticPlants = [
    {
        id: 'static-p1',
        name: 'Monstera Deliciosa',
        price: 649,
        description: 'The iconic Swiss cheese plant. Effortlessly tropical, with dramatic split leaves that purify air and elevate any interior instantly.',
        image_url: 'https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'indoor',
    },
    {
        id: 'static-p2',
        name: 'Fiddle Leaf Fig',
        price: 899,
        description: 'The ultimate designer plant. Its broad, violin-shaped leaves make a dramatic statement in bright living rooms and offices.',
        image_url: 'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'indoor',
    },
    {
        id: 'static-p3',
        name: 'Peace Lily',
        price: 399,
        description: 'A NASA-certified air purifier. Elegant white blooms and glossy deep-green leaves — thrives in low light, perfect for beginners.',
        image_url: 'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'airpurifying',
    },
    {
        id: 'static-p4',
        name: 'Snake Plant (Sansevieria)',
        price: 349,
        description: 'Nearly indestructible. Absorbs toxins and releases oxygen at night — the perfect bedroom companion for better sleep.',
        image_url: 'https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'airpurifying',
    },
    {
        id: 'static-p5',
        name: 'Golden Pothos',
        price: 249,
        description: 'Trail it on a shelf or climb it on a pole — the pothos adapts to any style. Ideal for beginners, nearly impossible to kill.',
        image_url: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'indoor',
    },
    {
        id: 'static-p6',
        name: 'ZZ Plant',
        price: 499,
        description: 'Glossy, architectural foliage with an almost sculptural quality. Survives neglect, low light, and irregular watering gracefully.',
        image_url: 'https://images.pexels.com/photos/6297370/pexels-photo-6297370.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'indoor',
    },
    {
        id: 'static-p7',
        name: 'Aloe Vera',
        price: 299,
        description: "Nature's first-aid kit. Soothing gel for burns and cuts, while the striking upright form brings desert beauty indoors.",
        image_url: 'https://images.pexels.com/photos/1903965/pexels-photo-1903965.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'succulent',
    },
    {
        id: 'static-p8',
        name: 'Bird of Paradise',
        price: 1299,
        description: 'The crown jewel of interior plants. Stunning paddle-shaped leaves with a striking tropical presence. Makes any room a showstopper.',
        image_url: 'https://images.pexels.com/photos/4166573/pexels-photo-4166573.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'indoor',
    },
]

export const staticFertilizers = [
    {
        id: 'static-f1',
        name: 'Organic Seaweed Extract',
        price: 299,
        description: 'Cold-pressed from fresh seaweed. Rich in natural growth hormones, trace minerals, and amino acids. Boosts root strength and leaf colour.',
        image_url: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'fertilizer',
    },
    {
        id: 'static-f2',
        name: 'Premium Vermicompost',
        price: 199,
        description: 'Earth-worm-processed organic compost. Improves soil aeration, water retention, and microbial activity for thriving roots.',
        image_url: 'https://images.pexels.com/photos/4505161/pexels-photo-4505161.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'fertilizer',
    },
    {
        id: 'static-f3',
        name: 'Slow Release Granules (NPK 14-14-14)',
        price: 349,
        description: 'Feeds plants continuously for up to 6 months. Reduces risk of over-feeding and supports consistent, balanced growth year-round.',
        image_url: 'https://images.pexels.com/photos/1329813/pexels-photo-1329813.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'fertilizer',
    },
    {
        id: 'static-f4',
        name: 'Liquid Grow Booster',
        price: 249,
        description: 'Fast-acting liquid formula with high nitrogen content. Triggers explosive leaf growth in 7–10 days. Dilute and apply fortnightly.',
        image_url: 'https://images.pexels.com/photos/4750270/pexels-photo-4750270.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'fertilizer',
    },
]

export const allStaticProducts = [...staticPlants, ...staticFertilizers]
