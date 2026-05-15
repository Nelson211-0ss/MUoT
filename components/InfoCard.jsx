export default function InfoCard({ icon: Icon, title, desc, children }) {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 h-full hover:-translate-y-0.5 transition-transform duration-200">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mb-4">
          <Icon size={22} strokeWidth={2} />
        </div>
      )}
      <h3 className="font-bold text-primary text-lg mb-2">{title}</h3>
      {desc && <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>}
      {children}
    </div>
  )
}
