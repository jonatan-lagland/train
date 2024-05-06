const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

type UnsplashImage = {
    id: string
    urls: {
        regular: string;
    };
}

const defaultBanner = 'https://images.pexels.com/photos/15171912/pexels-photo-15171912/free-photo-of-luonto-taivas-auringonlasku-pilvet.jpeg'

async function fetchImages(location: string): Promise<string> {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${location}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data: { results: UnsplashImage[] } = await response.json();
        const imageUrl = data.results.length > 0 ? data.results[0].urls.regular : null;
        return imageUrl ? imageUrl : defaultBanner;
    } catch (error) {
        console.error('Error fetching images from Unsplash:', error);
        return defaultBanner;
    }
}

export default fetchImages;
