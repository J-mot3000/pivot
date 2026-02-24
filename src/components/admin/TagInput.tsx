interface TagInputProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
}

const formatTags = (values: string[]) => values.filter(Boolean).join(', ')

export function TagInput({ label, value, onChange }: TagInputProps) {
  return (
    <label>
      {label}
      <input
        value={formatTags(value)}
        onChange={(event) => {
          const input = event.target.value
          const tags = input
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
          onChange(tags)
        }}
        onBlur={(event) => {
          const input = event.target.value
          if (input.endsWith(',')) {
            const tags = input
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
            onChange(tags)
          }
        }}
      />
    </label>
  )
}
