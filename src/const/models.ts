export const text_to_image_models = [
    {
        model: "black-forest-labs/FLUX.1-schnell",
        description: "A high-speed, efficient model designed for rapid text-to-image generation with visually detailed outputs."
    },
    {
        model: "black-forest-labs/FLUX.1-dev",
        description: "A developer-oriented version of the FLUX model, ideal for testing and experimental generation tasks."
    },
    {
        model: "aleksa-codes/flux-ghibsky-illustration",
        description: "Creates artistic, Ghibli-inspired illustrations, providing stylized visuals with a whimsical, storybook quality."
    },
    {
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        description: "The foundational model for Stable Diffusion's XL series, producing high-quality, large-scale image generations from text."
    },
    {
        model: "stabilityai/stable-diffusion-3.5-large",
        description: "An advanced version of Stable Diffusion, offering greater image clarity and detail, ideal for high-resolution applications."
    },
]

export const image_to_image_models = [
    {
        model: "lllyasviel/sd-controlnet-depth",
        description: "Enhances images by leveraging depth information to produce realistic transformations and improvements on existing visuals."
    },
    {
        model: "stabilityai/stable-diffusion-xl-refiner-1.0",
        description: "Refines initial image generations with enhanced details and adjustments, creating polished and higher-quality visuals."
    },
    {
        model: "alimama-creative/FLUX.1-dev-Controlnet-Inpainting-Beta",
        description: "Specialized for inpainting tasks, allowing selective image edits and restoration of image parts with great precision."
    },
    {
        model: "jasperai/Flux.1-dev-Controlnet-Upscaler",
        description: "An upscaling model that increases image resolution while maintaining visual quality and detail, ideal for enhancing lower-resolution images."
    },
    {
        model: "enhanceaiteam/Flux-Uncensored-V2",
        description: "A versatile model for unrestricted, high-fidelity image modifications and enhancements across a wide range of inputs."
    },
]

export const text_to_speech_models = [
    {
        model: "espnet/kan-bayashi_ljspeech_vits",
        description: "A natural-sounding text-to-speech model trained on LJSpeech, optimized for smooth and expressive voice output."
    },
    {
        model: "myshell-ai/MeloTTS-English",
        description: "An English TTS model focusing on melodic and rhythmic naturalness, providing clear and fluid speech synthesis."
    },
    {
        model: "microsoft/speecht5_tts",
        description: "Microsoft's SpeechT5 model delivers versatile TTS functionality, generating high-quality and natural-sounding speech."
    },
]
