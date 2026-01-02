import Link from 'next/link';
import { ArrowRight, Football, Trophy, Calendar, MapPin } from 'lucide-react';

const sportTypes = [
  {
    name: 'Football',
    icon: '⚽',
    href: '/venues?sport=football',
    color: 'bg-green-100 text-green-700',
  },
  {
    name: 'Badminton',
    icon: '🏸',
    href: '/venues?sport=badminton',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Pickleball',
    icon: '🎾',
    href: '/venues?sport=pickleball',
    color: 'bg-amber-100 text-amber-700',
  },
];

const features = [
  {
    icon: MapPin,
    title: 'Find Venues Near You',
    description: 'Discover sports facilities in your area with detailed information and photos.',
  },
  {
    icon: Calendar,
    title: 'Easy Booking',
    description: 'Book your preferred time slots in just a few clicks. No phone calls needed.',
  },
  {
    icon: Trophy,
    title: 'For Venue Owners',
    description: 'List your venue and reach more customers. Manage bookings effortlessly.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Book Sports Venues{' '}
            <span className="text-blue-600">Instantly</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover and book football stadiums, badminton courts, and pickleball courts
            near you. Simple, fast, and hassle-free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/venues"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Browse Venues
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Choose Your Sport
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {sportTypes.map((sport) => (
              <Link
                key={sport.name}
                href={sport.href}
                className={`${sport.color} rounded-2xl p-8 text-center hover:scale-105 transition-transform`}
              >
                <span className="text-5xl mb-4 block">{sport.icon}</span>
                <h3 className="text-xl font-semibold">{sport.name}</h3>
                <p className="text-sm mt-2 opacity-80">Find courts near you</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Book Your Game?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of players who book their sports venues through SportBook.
          </p>
          <Link
            href="/venues"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Find Venues Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Owner CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Own a Sports Venue?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            List your venue on SportBook and reach more customers. Manage bookings,
            set your prices, and grow your business.
          </p>
          <Link
            href="/auth/signup?role=owner"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Become a Partner
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
