const generateAdjacencyMatrix = (areaSize) => {
    // Generate 2D array of size areaSize.gridWidth * areaSize.gridHeight filled with 0s
    const adjacencyMatrix = Array.from(
      Array(areaSize.gridWidth * areaSize.gridHeight),
      (_) => Array(areaSize.gridWidth * areaSize.gridHeight).fill(0)
    );
  
    for (let y = 0; y < areaSize.gridHeight; y += 1) {
      for (let x = 0; x < areaSize.gridWidth; x += 1) {
        const currentgridnum = y * areaSize.gridWidth + x;
  
        if (x + 1 < areaSize.gridWidth) {
          const neighbourgridnum = y * areaSize.gridWidth + x + 1;
          adjacencyMatrix[currentgridnum][neighbourgridnum] = 1;
          adjacencyMatrix[neighbourgridnum][currentgridnum] = 1;
        }
  
        if (y + 1 < areaSize.gridHeight) {
          const neighbourgridnum = (y + 1) * areaSize.gridWidth + x;
          adjacencyMatrix[currentgridnum][neighbourgridnum] = 1;
          adjacencyMatrix[neighbourgridnum][currentgridnum] = 1;
        }
      }
    }
    return adjacencyMatrix;
  };
  
  const coordinateTogridNum = (array, areaSize) => {
    return array[1] * areaSize.gridWidth + array[0];
  };
  
  const gridNumToCoordinate = (num, areaSize) => {
    const array = [0, 0];
    array[0] = num % areaSize.gridWidth;
    array[1] = Math.floor(num / areaSize.gridWidth);
  
    return array;
  };
  
  export { generateAdjacencyMatrix, coordinateTogridNum, gridNumToCoordinate };