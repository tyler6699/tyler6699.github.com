ResizeNearestNeighbor = function (srcImageData, width, height) {
    var srcPixels    = srcImageData.data,
        srcWidth     = srcImageData.width,
        srcHeight    = srcImageData.height,
        srcLength    = srcPixels.length,
        dstImageData = this.utils.createImageData(width, height),
        dstPixels    = dstImageData.data;

    var xFactor = srcWidth / width,
        yFactor = srcHeight / height,
        dstIndex = 0, srcIndex,
        x, y, offset;

    for (y = 0; y < height; y += 1) {
        offset = ((y * yFactor) | 0) * srcWidth;

        for (x = 0; x < width; x += 1) {
            srcIndex = (offset + x * xFactor) << 2;

            dstPixels[dstIndex]     = srcPixels[srcIndex];
            dstPixels[dstIndex + 1] = srcPixels[srcIndex + 1];
            dstPixels[dstIndex + 2] = srcPixels[srcIndex + 2];
            dstPixels[dstIndex + 3] = srcPixels[srcIndex + 3];
            dstIndex += 4;
        }
    }
    return dstImageData;
};
