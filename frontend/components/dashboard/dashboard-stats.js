export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-sm border transform transition-all hover:shadow-md hover:-translate-y-1 duration-300"
        >
          <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
        </div>
      ))}
    </div>
  )
}

