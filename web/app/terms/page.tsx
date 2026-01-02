/**
 * Terms of Service Page
 */

import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>

          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using SportBook ("the Platform"), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p className="text-gray-700">
                SportBook is a platform that connects users with sports facility owners for booking
                football stadiums, badminton courts, pickleball courts, and other sports facilities.
                We facilitate the booking process but do not own or operate any sports facilities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
              <div className="text-gray-700 space-y-3">
                <p>To use the Platform, you must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be at least 18 years old</li>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of unauthorized use</li>
                </ul>
                <p>You are responsible for all activities that occur under your account.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Bookings and Payments</h2>
              <div className="text-gray-700 space-y-3">
                <ul className="list-disc pl-6 space-y-2">
                  <li>All bookings are subject to availability</li>
                  <li>Cancellations must be made at least 2 hours before the booking time</li>
                  <li>No-shows may result in forfeiture of payment</li>
                  <li>Prices are set by venue owners and may change without notice</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. User Conduct</h2>
              <p className="text-gray-700 mb-3">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Use the Platform for any illegal purpose</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Post false or misleading information</li>
                <li>Attempt to gain unauthorized access to the Platform</li>
                <li>Interfere with or disrupt the Platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Venue Owner Responsibilities</h2>
              <div className="text-gray-700 space-y-3">
                <p>As a venue owner, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate information about your facilities</li>
                  <li>Honor all confirmed bookings</li>
                  <li>Maintain your facilities in safe and clean condition</li>
                  <li>Respond to booking requests promptly</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
              <p className="text-gray-700">
                SportBook shall not be liable for any indirect, incidental, special, consequential,
                or punitive damages arising from your use of the Platform. We are not responsible for
                the conduct of venues or other users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Termination</h2>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate your account at any time for violation
                of these Terms or for any other reason at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to Terms</h2>
              <p className="text-gray-700">
                We may modify these Terms at any time. Your continued use of the Platform after
                such changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                Email: <a href="mailto:support@sportbook.com" className="text-blue-600 hover:underline">support@sportbook.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} SportBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
