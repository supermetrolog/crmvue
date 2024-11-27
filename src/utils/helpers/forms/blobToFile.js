/**
 * Convert Blob to File
 *
 * @param {Blob} blob
 * @param {File} oldFile
 * @return {File}
 */
export function blobToFile(blob, oldFile) {
    const file = new File([blob], oldFile.name);
    if (file.size !== oldFile.size) file.originalSize = oldFile.size;

    return file;
}
