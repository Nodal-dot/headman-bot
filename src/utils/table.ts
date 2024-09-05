export const table = (data: string[][]): string => {
    const [headers, ...rows] = data;
    const columnWidths = headers.map((_, index) => {
        return Math.max(
            ...data.map(row => row[index]).map(cell => cell.length),
        );
    });

    const formatCell = (cell: string, width: number) => {
        return `| ${cell.padEnd(width)} `;
    };

    const headerRow =
        headers
            .map((header, index) => formatCell(header, columnWidths[index]))
            .join('|') + '|';
    const separatorRow = columnWidths
        .map(width => `|${'-'.repeat(width + 2)}|`)
        .join('');
    const rowRows = rows.map(
        row =>
            row
                .map((cell, index) => formatCell(cell, columnWidths[index]))
                .join('|') + '|',
    );

    return [headerRow, separatorRow, ...rowRows].join('\n');
};
