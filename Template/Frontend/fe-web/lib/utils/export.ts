import * as XLSX from 'xlsx'

export type ExportFormat = 'excel' | 'csv'

export function exportData(format: ExportFormat, rows: Record<string, any>[], sheetName: string, fileBaseName: string) {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)

  if (format === 'excel') {
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, `${fileBaseName}.xlsx`)
  } else {
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${fileBaseName}.csv`
    link.click()
  }
}
