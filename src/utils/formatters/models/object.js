const townPatterns = ['область', 'обл.', 'москва'];

export function getObjectMbUniqueAddress(address) {
    const addressBlocks = address.split(',');
    if (addressBlocks.length === 1) return addressBlocks[0];

    let startIndex = 0;

    const hasCountryNameInAddress = addressBlocks[0].toLowerCase().trim() === 'россия';
    if (hasCountryNameInAddress) startIndex++;

    const maybeTown = addressBlocks[startIndex].toLowerCase().trim();
    const hasTownPattern = townPatterns.some(element => maybeTown.includes(element));

    if (hasTownPattern && addressBlocks.length > startIndex + 1)
        return addressBlocks[startIndex + 1];
    return addressBlocks[startIndex];
}
