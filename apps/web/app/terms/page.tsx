export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Last Updated */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">Last updated: December 2024</p>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h2>
          <p className="text-lg text-gray-600">
            Welcome to DadConnect! These Terms of Service ("Terms") govern your use of our platform and services. By accessing or using DadConnect, you agree to be bound by these Terms.
          </p>
        </div>

        {/* Acceptance of Terms */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Acceptance of Terms</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">
              By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use our services.
            </p>
            <p className="text-gray-600">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes through our platform or via email. Your continued use of our services after such modifications constitutes acceptance of the updated Terms.
            </p>
          </div>
        </div>

        {/* User Accounts */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">User Accounts</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Account Creation</h4>
                <p className="text-gray-600">To use our services, you must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Account Responsibility</h4>
                <p className="text-gray-600">You are responsible for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Age Requirements</h4>
                <p className="text-gray-600">You must be at least 18 years old to use our services. By using our platform, you represent that you meet this age requirement.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acceptable Use */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Acceptable Use</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Post, share, or transmit any content that is illegal, harmful, threatening, abusive, or defamatory</li>
              <li>Harass, intimidate, or bully other users</li>
              <li>Share personal information of others without their consent</li>
              <li>Use our services for commercial purposes without permission</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Upload or transmit viruses, malware, or other harmful code</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate another person or entity</li>
            </ul>
          </div>
        </div>

        {/* Content and Intellectual Property */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Content and Intellectual Property</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Your Content</h4>
                <p className="text-gray-600">You retain ownership of content you post on our platform. By posting content, you grant us a license to use, display, and distribute your content in connection with our services.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Our Content</h4>
                <p className="text-gray-600">All content, features, and functionality of our platform are owned by DadConnect and are protected by copyright, trademark, and other intellectual property laws.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Content Moderation</h4>
                <p className="text-gray-600">We reserve the right to review, edit, or remove any content that violates these Terms or our community guidelines.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy and Data */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Privacy and Data</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">
              Your privacy is important to us. Our collection and use of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p className="text-gray-600">
              By using our services, you consent to the collection, use, and sharing of your information as described in our Privacy Policy.
            </p>
          </div>
        </div>

        {/* Service Availability */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Service Availability</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">
              We strive to provide reliable service, but we cannot guarantee that our services will be available at all times. We may experience downtime for maintenance, updates, or technical issues.
            </p>
            <p className="text-gray-600">
              We reserve the right to modify, suspend, or discontinue any part of our services at any time without notice.
            </p>
          </div>
        </div>

        {/* Termination */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Termination</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Termination by You</h4>
                <p className="text-gray-600">You may terminate your account at any time by contacting us or using the account deletion feature in your settings.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Termination by Us</h4>
                <p className="text-gray-600">We may terminate or suspend your account if you violate these Terms or engage in behavior that we determine to be harmful to our community.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Effect of Termination</h4>
                <p className="text-gray-600">Upon termination, your right to use our services will cease immediately. We may delete your account and associated data in accordance with our data retention policies.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Disclaimers</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">
              Our services are provided "as is" and "as available" without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
              <li>Warranties that our services will be uninterrupted or error-free</li>
              <li>Warranties regarding the security of our platform</li>
            </ul>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Limitation of Liability</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, DadConnect shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Loss of profits, data, or use</li>
              <li>Business interruption</li>
              <li>Personal injury or property damage</li>
              <li>Emotional distress</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Our total liability to you for any claims arising from these Terms or your use of our services shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </div>
        </div>

        {/* Governing Law */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Governing Law</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600">
              These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. Any disputes arising from these Terms or your use of our services shall be resolved in the courts of California.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-600">
            <p><strong>Email:</strong> <a href="mailto:legal@dadconnect.com" className="text-blue-600 hover:text-blue-700">legal@dadconnect.com</a></p>
            <p><strong>Address:</strong> DadConnect Legal Team, 123 Dad Street, Father City, FC 12345</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/groups" className="hover:text-blue-600">
                    Groups
                  </a>
                </li>
                <li>
                  <a href="/meetups" className="hover:text-blue-600">
                    Events
                  </a>
                </li>
                <li>
                  <a href="/discussions" className="hover:text-blue-600">
                    Discussions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/library" className="hover:text-blue-600">
                    Articles
                  </a>
                </li>
                <li>
                  <a href="/guides" className="hover:text-blue-600">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="/tools" className="hover:text-blue-600">
                    Tools
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/help" className="hover:text-blue-600">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-blue-600">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/safety" className="hover:text-blue-600">
                    Safety
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/privacy" className="hover:text-blue-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-blue-600">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/guidelines" className="hover:text-blue-600">
                    Community Guidelines
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">© 2024 DadConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
