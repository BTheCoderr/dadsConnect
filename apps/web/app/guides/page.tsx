export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Parenting Guides</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Suggest Guide
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Expert Parenting Guides</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive guides written by experienced dads and parenting experts to help you navigate fatherhood with confidence.
          </p>
        </div>

        {/* Featured Guides */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Guide Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">👶</div>
                  <h4 className="font-semibold">New Dad Survival Guide</h4>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">The Complete New Dad Survival Guide</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Everything you need to know for the first 6 months of fatherhood, from diaper changes to sleep schedules.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">15 min read</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Read Guide →
                  </button>
                </div>
              </div>
            </div>

            {/* Guide Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🍎</div>
                  <h4 className="font-semibold">Nutrition Guide</h4>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Healthy Eating for Kids</h4>
                <p className="text-gray-600 text-sm mb-4">
                  A comprehensive guide to feeding your children nutritious meals and developing healthy eating habits.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">12 min read</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Read Guide →
                  </button>
                </div>
              </div>
            </div>

            {/* Guide Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">😴</div>
                  <h4 className="font-semibold">Sleep Training</h4>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Sleep Training Methods That Work</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Proven techniques to help your child sleep through the night and establish healthy sleep patterns.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">18 min read</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Read Guide →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  All Guides
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  New Dads
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Toddlers
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  School Age
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Health & Safety
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Activities
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Discipline
                </button>
              </div>
            </div>
          </div>

          {/* Guides List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">All Guides</h3>
                  <div className="flex items-center space-x-2">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>Most Popular</option>
                      <option>Most Recent</option>
                      <option>Alphabetical</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {/* Guide Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👶</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">The New Dad's First Week</h4>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">New Dads</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        A day-by-day guide to surviving your first week as a new dad, including what to expect and how to support your partner.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by Dr. Michael Johnson</span>
                        <span>8 min read</span>
                        <span>4.9 ⭐ (127 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guide Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🍎</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Meal Planning for Busy Families</h4>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Health & Safety</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Learn how to plan nutritious meals for your family while juggling work and parenting responsibilities.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by Chef David Martinez</span>
                        <span>12 min read</span>
                        <span>4.8 ⭐ (89 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guide Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Creative Activities for Rainy Days</h4>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Activities</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Fun and educational indoor activities to keep your kids entertained when you can't go outside.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by Sarah Thompson</span>
                        <span>10 min read</span>
                        <span>4.7 ⭐ (156 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guide Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">⚖️</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Positive Discipline Techniques</h4>
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Discipline</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Effective discipline strategies that build character and strengthen your relationship with your child.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by Dr. Robert Chen</span>
                        <span>15 min read</span>
                        <span>4.9 ⭐ (203 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t">
                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                  Load More Guides
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
