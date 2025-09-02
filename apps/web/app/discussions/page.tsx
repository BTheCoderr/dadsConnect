import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

export default function DiscussionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Discussions</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Discussion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  All Discussions
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  New Dads
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Single Dads
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Work-Life Balance
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Parenting Tips
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Health & Wellness
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Discussions</h2>
                  <div className="flex items-center space-x-2">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>Most Recent</option>
                      <option>Most Popular</option>
                      <option>Most Replies</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {/* Discussion Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">JD</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">Sleep training tips for 6-month-old</h3>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">New Dads</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        My little one is having trouble sleeping through the night. Any experienced dads have advice on sleep training methods that worked for them?
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by John D. • 2 hours ago</span>
                        <span>12 replies</span>
                        <span>8 likes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discussion Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">MS</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">Best activities for rainy days with toddlers</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Parenting Tips</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        It's been raining all week and my 3-year-old is getting restless. What are your go-to indoor activities to keep them entertained?
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by Mike S. • 4 hours ago</span>
                        <span>18 replies</span>
                        <span>15 likes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discussion Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">AR</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">Balancing work and family time</h3>
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Work-Life Balance</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        I'm struggling to find the right balance between my demanding job and being present for my kids. How do other working dads manage this?
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by Alex R. • 6 hours ago</span>
                        <span>25 replies</span>
                        <span>22 likes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discussion Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold text-sm">TW</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">Healthy meal prep ideas for busy dads</h3>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Health & Wellness</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Looking for quick, healthy meal prep ideas that the whole family will enjoy. What are your favorite recipes?
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by Tom W. • 8 hours ago</span>
                        <span>14 replies</span>
                        <span>11 likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t">
                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                  Load More Discussions
                </button>
              </div>
            </div>
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
