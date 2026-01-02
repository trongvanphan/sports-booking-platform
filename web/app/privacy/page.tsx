/**
 * Privacy Policy Page
 */

import Link from 'next/link';
import { ChevronLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>

          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-700">
                SportBook ("we," "our," or "us") respects your privacy and is committed to protecting
                your personal data. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you use our Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-3">We collect information you provide directly, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Name and email address</li>
                <li>Phone number (optional)</li>
                <li>Account credentials</li>
                <li>Payment information (processed securely by third parties)</li>
                <li>Profile picture</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">2.2 Venue Information (for Owners)</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Venue name and description</li>
                <li>Address and location data</li>
                <li>Photos of facilities</li>
                <li>Pricing information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-3">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Create and manage your account</li>
                <li>Process bookings and payments</li>
                <li>Communicate with you about your bookings</li>
                <li>Provide customer support</li>
                <li>Improve our services</li>
                <li>Send you updates and promotional content (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing</h2>
              <p className="text-gray-700 mb-3">We may share your information with:</p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">4.1 Venue Owners</h3>
              <p className="text-gray-700">
                When you make a booking, we share your name and contact information with the
                venue owner to fulfill your booking.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">4.2 Service Providers</h3>
              <p className="text-gray-700">
                We use third-party services for hosting, authentication, and payment processing.
                These providers have access to your information only to perform services on our behalf.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">4.3 Legal Requirements</h3>
              <p className="text-gray-700">
                We may disclose your information if required by law or to protect our rights,
                property, or safety.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate technical and organizational measures to protect your
                personal data against unauthorized access, alteration, disclosure, or destruction.
                However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="text-gray-700 mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
                <li>Object to processing of your data</li>
              </ul>
              <p className="text-gray-700 mt-3">
                To exercise these rights, contact us at support@sportbook.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-3">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Remember your preferences</li>
                <li>Keep you logged in</li>
                <li>Analyze platform usage</li>
                <li>Improve our services</li>
              </ul>
              <p className="text-gray-700 mt-3">
                You can manage cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal data for as long as necessary to provide our services
                and comply with legal obligations. You can request deletion of your account
                and data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
              <p className="text-gray-700">
                Our Platform is not intended for children under 18. We do not knowingly collect
                personal information from children under 18. If you become aware that a child
                has provided us with personal data, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. International Data Transfers</h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than
                your own. We ensure appropriate safeguards are in place to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of
                significant changes by posting the new policy on the Platform and updating
                the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Us</h2>
              <p className="text-gray-700 mb-3">
                If you have questions about this Privacy Policy or our data practices, please contact:
              </p>
              <p className="text-gray-700">
                Email: <a href="mailto:privacy@sportbook.com" className="text-blue-600 hover:underline">privacy@sportbook.com</a>
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
