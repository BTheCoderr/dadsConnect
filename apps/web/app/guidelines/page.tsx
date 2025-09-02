export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Community Guidelines</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Community Guidelines</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These guidelines help create a safe, supportive, and inclusive environment for all dads in our community. By participating in DadConnect, you agree to follow these guidelines.
          </p>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="font-semibold text-gray-900">Respect</h4>
              </div>
              <p className="text-gray-600 text-sm">Treat all community members with dignity and respect, regardless of background, experience, or parenting style.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">💙</span>
                </div>
                <h4 className="font-semibold text-gray-900">Support</h4>
              </div>
              <p className="text-gray-600 text-sm">Offer encouragement, share experiences, and provide helpful advice to fellow dads on their parenting journey.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🌟</span>
                </div>
                <h4 className="font-semibold text-gray-900">Inclusion</h4>
              </div>
              <p className="text-gray-600 text-sm">Welcome dads from all walks of life and create an environment where everyone feels valued and heard.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h4 className="font-semibold text-gray-900">Safety</h4>
              </div>
              <p className="text-gray-600 text-sm">Maintain a safe space for sharing personal experiences and seeking advice without fear of judgment or harassment.</p>
            </div>
          </div>
        </div>

        {/* Do's */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">What We Encourage</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-gray-700">Share your parenting experiences and lessons learned</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-gray-700">Ask questions and seek advice from other dads</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-gray-700">Offer constructive feedback and encouragement</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-gray-700">Organize and participate in community events</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-gray-700">Respect different parenting approaches and philosophies</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-gray-700">Report inappropriate behavior or content</p>
              </div>
            </div>
          </div>
        </div>

        {/* Don'ts */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">What We Don't Allow</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-xs">✗</span>
                </div>
                <p className="text-gray-700">Harassment, bullying, or intimidation of any kind</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-xs">✗</span>
                </div>
                <p className="text-gray-700">Discriminatory language or behavior based on race, gender, religion, or other protected characteristics</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-xs">✗</span>
                </div>
                <p className="text-gray-700">Sharing personal information of others without consent</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-xs">✗</span>
                </div>
                <p className="text-gray-700">Spam, self-promotion, or commercial content without permission</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-xs">✗</span>
                </div>
                <p className="text-gray-700">Inappropriate, offensive, or explicit content</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-xs">✗</span>
                </div>
                <p className="text-gray-700">Medical advice or diagnosis (encourage consulting healthcare professionals)</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-xs">✗</span>
                </div>
                <p className="text-gray-700">Impersonating other users or creating fake accounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Guidelines */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Content Guidelines</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Posts and Comments</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Keep discussions relevant to parenting, fatherhood, and community topics</li>
                  <li>Use clear, respectful language that others can understand</li>
                  <li>Provide context when sharing personal experiences</li>
                  <li>Be mindful of the impact your words may have on others</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Images and Media</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Only share images you have the right to use</li>
                  <li>Respect privacy - don't share photos of children without parental consent</li>
                  <li>Avoid graphic or disturbing content</li>
                  <li>Use appropriate captions and descriptions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Meetups and Events</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Choose safe, public locations for meetups</li>
                  <li>Provide clear details about event logistics</li>
                  <li>Respect others' boundaries and comfort levels</li>
                  <li>Follow local laws and regulations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Enforcement */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Enforcement</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">
              We take these guidelines seriously and have a team dedicated to maintaining a positive community environment. When violations occur, we may take the following actions:
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-yellow-600 text-xs">1</span>
                </div>
                <p className="text-gray-600">Warning and education about community guidelines</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 text-xs">2</span>
                </div>
                <p className="text-gray-600">Temporary restrictions on posting or commenting</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-xs">3</span>
                </div>
                <p className="text-gray-600">Permanent account suspension for severe or repeated violations</p>
              </div>
            </div>
            <p className="text-gray-600 mt-4">
              We encourage community members to report violations using our reporting tools. All reports are reviewed by our moderation team.
            </p>
          </div>
        </div>

        {/* Appeals */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Appeals Process</h3>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">
              If you believe a moderation action was taken in error, you can appeal the decision by contacting our support team. We will review your appeal and provide a response within 5 business days.
            </p>
            <p className="text-gray-600">
              To submit an appeal, please contact us at <a href="mailto:appeals@dadconnect.com" className="text-blue-600 hover:text-blue-700">appeals@dadconnect.com</a> with your account information and a detailed explanation of why you believe the action was incorrect.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions or Concerns?</h3>
          <p className="text-gray-600 mb-4">
            If you have questions about these guidelines or need to report a violation, please contact us:
          </p>
          <div className="space-y-2 text-gray-600">
            <p><strong>Email:</strong> <a href="mailto:community@dadconnect.com" className="text-blue-600 hover:text-blue-700">community@dadconnect.com</a></p>
            <p><strong>Report Issues:</strong> Use the report button on any post or comment</p>
            <p><strong>Emergency:</strong> For urgent safety concerns, contact local authorities</p>
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
