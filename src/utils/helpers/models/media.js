const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export function isImageMedia(media) {
    return IMAGE_MIME_TYPES.has(media.mime_type);
}
