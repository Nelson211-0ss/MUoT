export default function SectionHeader({ title, subtitle, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center'

  return (
    <div className={`mb-10 md:mb-12 ${alignClass}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">{title}</h2>
      {subtitle && (
        <p className={`text-gray-500 text-base md:text-lg max-w-2xl leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
