interface Props {
  cols?: number
  rows?: number
}

export function SkeletonRow({ cols = 6, rows = 5 }: Props) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className="h-4 bg-gray-100 rounded-md animate-pulse"
                style={{ width: j === 0 ? '40%' : j === cols - 1 ? '20%' : '70%' }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
