import Replicate from "replicate";

export async function handler(event) {
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    try {
        const { image } = JSON.parse(event.body);

        const output = await replicate.run(
            "black-forest-labs/flux-kontext-pro",
            {
                input: {
                    image: image,
                    prompt: "Professional garden landscaping, same layout, lush green grass, clean lawn, decorative plants, modern garden, realistic photo, professional gardening photography",
                    guidance_scale: 7,
                    num_inference_steps: 30,
                    prompt_strength: 0.65
                }
            }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                output: output[0]
            })
        };

    } catch (error) {
        console.error("Replicate Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}
