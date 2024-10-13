type Dimension = {
    width: number,
    height: number
}
const lineSize = 3;
function drawScreen(
    dims: Dimension,
    grid: boolean[][],
    r: CanvasRenderingContext2D,
) {
    const rows = grid.length,
        cols = grid[0].length,
        cellWidth = Math.round((dims.width - lineSize * (cols - 1)) / (cols) * 2) / 2,
        cellHeight = Math.round((dims.height - lineSize * (rows - 1)) / (rows) * 2) / 2;

    function drawSquares() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (!grid[i][j])
                    continue;
                r.rect(i * (cellWidth + lineSize), j * (cellHeight + lineSize), cellWidth, cellHeight);
            }
        }
    }
    function drawLines() {
        // Vertical Lines
        for (let i = 1; i < cols; i++) {
            r.rect(i * cellWidth + lineSize * (i - 1), 0, lineSize, height)
        }
        // Horizontal Lines
        for (let i = 1; i < rows; i++) {
            r.rect(0, i * cellHeight + lineSize * (i - 1), width, lineSize);
        }
    }
}

