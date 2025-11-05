const CIGAR_RE = /(\d+)([MIDNSHP=X])/g

export function alignedLengthFromCigar(cigar: string): number {
  if (!cigar) return 0
  let len = 0
  let match: RegExpExecArray | null
  CIGAR_RE.lastIndex = 0
  while ((match = CIGAR_RE.exec(cigar))) {
    const count = Number.parseInt(match[1], 10)
    const op = match[2]
    if (op === 'M' || op === '=' || op === 'X' || op === 'D' || op === 'N') {
      len += count
    }
  }
  return len
}
