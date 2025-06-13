import React from 'react';

const TrustIndicatorsSection: React.FC = () => {
  const stats = [
    { text: "10,000+", subtitle: "Happy Customers" },
    { text: "50+", subtitle: "Premium Brands" },
    { text: "24/7", subtitle: "Customer Support" },
    { text: "100%", subtitle: "Authentic Products" }
  ];

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.text}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicatorsSection;
