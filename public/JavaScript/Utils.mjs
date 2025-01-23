export function extractIconImages(result) {
    const iconImages = [];

    result.forEach(item => {
        if (Array.isArray(item.images?.icon)) {
            iconImages.push(...item.images.icon.map(icon => `..${icon}`));
        } else if (item.images?.icon) {
            iconImages.push(`..${item.images.icon}`);
        } else {
            console.warn(`Missing 'images.icon' for item:`, item);
        }
    });

    return iconImages;
}