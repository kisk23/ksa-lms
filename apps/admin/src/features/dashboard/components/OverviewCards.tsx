export function OverviewCards() {
  const stats = [
    { label: 'Total Users', value: '0', change: '+0%' },
    { label: 'Active Courses', value: '0', change: '+0%' },
    { label: 'Enrollments', value: '0', change: '+0%' },
    { label: 'Revenue', value: '$0', change: '+0%' },
  ];

  return (
    <div className="overview-cards">
      {stats.map((stat) => (
        <div key={stat.label} className="overview-card">
          <p className="overview-card__label">{stat.label}</p>
          <h3 className="overview-card__value">{stat.value}</h3>
          <span className="overview-card__change">{stat.change}</span>
        </div>
      ))}
    </div>
  );
}
