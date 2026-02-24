interface SkillsTagsProps {
  skills: string[]
}

export function SkillsTags({ skills }: SkillsTagsProps) {
  return (
    <div className="tag-list">
      {skills.map((skill) => (
        <span key={skill} className="tag">
          {skill}
        </span>
      ))}
    </div>
  )
}
