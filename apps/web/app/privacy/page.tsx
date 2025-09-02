export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
          <p className="text-lg text-gray-600">
            At DadConnect, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Name and email address</li>
                  <li>Profile information (bio, interests, location)</li>
                  <li>Profile pictures and other images you choose to share</li>
                  <li>Communication preferences</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Usage Information</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Posts, comments, and messages you create</li>
                  <li>Groups you join and events you attend</li>
                  <li>Articles you save and content you interact with</li>
                  <li>Device information and IP address</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Technical Information</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on our platform</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-xs">✓</span>
                </div>
                <p className="text-gray-600">Provide and maintain our services</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-xs">✓</span>
                </div>
                <p className="text-gray-600">Connect you with other dads and relevant groups</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-xs">✓</span>
                </div>
                <p className="text-gray-600">Send you important updates and notifications</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-xs">✓</span>
                </div>
                <p className="text-gray-600">Improve our platform and develop new features</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-xs">✓</span>
                </div>
                <p className="text-gray-600">Ensure platform safety and prevent abuse</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-xs">✓</span>
                </div>
                <p className="text-gray-600">Provide customer support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or court orders</li>
              <li>To protect our rights, property, or safety, or that of our users</li>
              <li>With service providers who assist us in operating our platform (under strict confidentiality agreements)</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </div>
        </div>

        {/* Data Security */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Data Security</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication systems</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
          </div>
        </div>

        {/* Your Rights */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Rights</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Restriction:</strong> Request limitation of how we process your information</li>
              <li><strong>Objection:</strong> Object to certain types of processing</li>
            </ul>
            <p className="text-gray-600 mt-4">
              To exercise these rights, please contact us at <a href="mailto:privacy@dadconnect.com" className="text-blue-600 hover:text-blue-700">privacy@dadconnect.com</a>
            </p>
          </div>
        </div>

        {/* Cookies */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Cookies and Tracking</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.
            </p>
            <p className="text-gray-600">
              For more information about our cookie practices, please see our Cookie Policy.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-gray-600">
            <p><strong>Email:</strong> <a href="mailto:privacy@dadconnect.com" className="text-blue-600 hover:text-blue-700">privacy@dadconnect.com</a></p>
            <p><strong>Address:</strong> DadConnect Privacy Team, 123 Dad Street, Father City, FC 12345</p>
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
