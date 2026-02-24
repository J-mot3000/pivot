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
        onChange={(event) =>
          onChange(
            event.target.value
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
          )
        }
      />
    </label>
  )
}
