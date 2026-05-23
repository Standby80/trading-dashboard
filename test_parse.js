const htmlContent = `
<tr align="right">
<td>2026-05-23 21:52:19</td>
<td>22834425</td>
<td>XAUUSD</td>
<td>sell</td>
<td>out</td>
<td>0.01</td>
<td>2333.16</td>
<td>22834424</td>
<td>0.00</td>
<td>0.00</td>
<td>-13.35</td>
</tr>
`;

const parseCleanNumber = (str) => {
  if (!str) return 0;
  const sanitized = str.replace(',', '.').replace(/\s+/g, '').replace(/[^0-9.-]/g, '');
  return parseFloat(sanitized) || 0;
};

const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
let rowMatch;
while ((rowMatch = rowRegex.exec(htmlContent)) !== null) {
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
  let cellMatch;
  const cells = [];
  while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
    const cleanText = cellMatch[1].replace(/<[^>]*>/g, '').trim();
    cells.push(cleanText);
  }
  console.log("Cells length:", cells.length);
  console.log("Cells array:", cells);
  
  if (cells.length >= 11) {
    const commission = parseCleanNumber(cells[8]);
    const swap = parseCleanNumber(cells[9]);
    const grossProfit = parseCleanNumber(cells[10]);
    console.log("Commission:", commission);
    console.log("Swap:", swap);
    console.log("Gross Profit:", grossProfit);
  }
}
