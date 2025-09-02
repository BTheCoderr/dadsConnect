export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Dad Tools</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Suggest Tool
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Essential Dad Tools</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Practical tools and calculators to help you navigate fatherhood with confidence and make informed decisions.
          </p>
        </div>

        {/* Featured Tools */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tool Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold text-gray-900">Growth Tracker</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Track your child's growth milestones and compare with developmental standards.
              </p>
              <a href="/tools/growth-tracker" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center">
                Use Tool
              </a>
            </div>

            {/* Tool Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💰</span>
                </div>
                <h4 className="font-semibold text-gray-900">College Savings Calculator</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Calculate how much you need to save for your child's college education.
              </p>
              <a href="/tools/college-savings" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors inline-block text-center">
                Use Tool
              </a>
            </div>

            {/* Tool Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⏰</span>
                </div>
                <h4 className="font-semibold text-gray-900">Sleep Schedule Planner</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Create optimal sleep schedules for your child based on age and needs.
              </p>
              <a href="/tools/sleep-planner" className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block text-center">
                Use Tool
              </a>
            </div>

            {/* Tool Card - Baby Name Generator */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👶</span>
                </div>
                <h4 className="font-semibold text-gray-900">Baby Name Generator</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Generate creative baby names by gender, origin, and length preferences.
              </p>
              <a href="/tools/baby-name-generator" className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors inline-block text-center">
                Use Tool
              </a>
            </div>

            {/* Tool Card - Diaper Calculator */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🧷</span>
                </div>
                <h4 className="font-semibold text-gray-900">Diaper Cost Calculator</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Calculate how much you'll spend on diapers from birth to potty training.
              </p>
              <a href="/tools/diaper-calculator" className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors inline-block text-center">
                Use Tool
              </a>
            </div>

            {/* Tool Card - Feeding Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🍼</span>
                </div>
                <h4 className="font-semibold text-gray-900">Feeding Schedule Planner</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Create optimal feeding schedules based on your baby's age and feeding type.
              </p>
              <a href="/tools/feeding-schedule" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-block text-center">
                Use Tool
              </a>
            </div>
          </div>
        </div>

        {/* All Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  All Tools
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Calculators
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Trackers
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Planners
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Generators
                </button>
                <button className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                  Checklists
                </button>
              </div>
            </div>
          </div>

          {/* Tools List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">All Tools</h3>
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
                {/* Tool Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Growth Tracker</h4>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Trackers</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Monitor your child's height, weight, and developmental milestones with our comprehensive growth tracking tool.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Free</span>
                        <span>4.9 ⭐ (234 reviews)</span>
                        <span>Used 1.2k times</span>
                      </div>
                    </div>
                    <a href="/tools/growth-tracker" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                      Use Tool
                    </a>
                  </div>
                </div>

                {/* Tool Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">College Savings Calculator</h4>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Calculators</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Calculate how much you need to save monthly to fund your child's college education based on current costs and inflation.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Free</span>
                        <span>4.8 ⭐ (189 reviews)</span>
                        <span>Used 856 times</span>
                      </div>
                    </div>
                    <a href="/tools/college-savings" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block">
                      Use Tool
                    </a>
                  </div>
                </div>

                {/* Tool Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">⏰</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Sleep Schedule Planner</h4>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Planners</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Create optimal sleep schedules for your child based on age, nap needs, and bedtime preferences.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Free</span>
                        <span>4.9 ⭐ (312 reviews)</span>
                        <span>Used 2.1k times</span>
                      </div>
                    </div>
                    <a href="/tools/sleep-planner" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block">
                      Use Tool
                    </a>
                  </div>
                </div>

                {/* Tool Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Activity Name Generator</h4>
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Generators</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Generate creative activity names for your dad group events, meetups, and community gatherings.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Free</span>
                        <span>4.7 ⭐ (156 reviews)</span>
                        <span>Used 743 times</span>
                      </div>
                    </div>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      Use Tool
                    </button>
                  </div>
                </div>

                {/* Tool Item */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">New Dad Checklist</h4>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Checklists</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Comprehensive checklist of everything you need to prepare for your new baby's arrival.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Free</span>
                        <span>4.9 ⭐ (278 reviews)</span>
                        <span>Used 1.8k times</span>
                      </div>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Use Tool
                    </button>
                  </div>
                </div>

                {/* Tool Item - Baby Name Generator */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👶</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Baby Name Generator</h4>
                        <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">Generators</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Generate creative baby names by gender, origin, and length preferences.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Free</span>
                        <span>4.8 ⭐ (245 reviews)</span>
                        <span>Used 1.5k times</span>
                      </div>
                    </div>
                    <a href="/tools/baby-name-generator" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors inline-block">
                      Use Tool
                    </a>
                  </div>
                </div>

                {/* Tool Item - Diaper Calculator */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🧷</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Diaper Cost Calculator</h4>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Calculators</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Calculate how much you'll spend on diapers from birth to potty training.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Free</span>
                        <span>4.7 ⭐ (198 reviews)</span>
                        <span>Used 892 times</span>
                      </div>
                    </div>
                    <a href="/tools/diaper-calculator" className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors inline-block">
                      Use Tool
                    </a>
                  </div>
                </div>

                {/* Tool Item - Feeding Schedule */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🍼</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Feeding Schedule Planner</h4>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">Planners</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Create optimal feeding schedules based on your baby's age and feeding type.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Free</span>
                        <span>4.9 ⭐ (267 reviews)</span>
                        <span>Used 1.3k times</span>
                      </div>
                    </div>
                    <a href="/tools/feeding-schedule" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-block">
                      Use Tool
                    </a>
                  </div>
                </div>
              </div>

              {/* Hidden tools that appear when "Load More" is clicked */}
              <div id="more-tools" className="hidden">
                {/* Tool Item - Budget Planner */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Family Budget Planner</h4>
                        <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">Calculators</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Plan your family budget with the 50/30/20 rule and track expenses.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Free</span>
                        <span>4.6 ⭐ (189 reviews)</span>
                        <span>Used 756 times</span>
                      </div>
                    </div>
                    <a href="/tools/budget-planner" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors inline-block">
                      Use Tool
                    </a>
                  </div>
                </div>

                {/* Tool Item - Activity Planner */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Activity Planner</h4>
                        <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full">Planners</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Get age-appropriate activity suggestions based on time, location, and weather.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Free</span>
                        <span>4.8 ⭐ (223 reviews)</span>
                        <span>Used 1.1k times</span>
                      </div>
                    </div>
                    <a href="/tools/activity-planner" className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors inline-block">
                      Use Tool
                    </a>
                  </div>
                </div>

                {/* Tool Item - Emergency Contacts */}
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🚨</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Emergency Contacts</h4>
                        <span className="bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded-full">Safety</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Create and manage your family's emergency contact list with print option.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Free</span>
                        <span>4.9 ⭐ (312 reviews)</span>
                        <span>Used 2.3k times</span>
                      </div>
                    </div>
                    <a href="/tools/emergency-contacts" className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors inline-block">
                      Use Tool
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t">
                <button 
                  id="load-more-btn"
                  onClick={() => {
                    const moreTools = document.getElementById('more-tools')
                    const loadMoreBtn = document.getElementById('load-more-btn')
                    if (moreTools && loadMoreBtn) {
                      moreTools.classList.remove('hidden')
                      loadMoreBtn.textContent = 'All Tools Loaded'
                      loadMoreBtn.classList.add('opacity-50', 'cursor-not-allowed')
                      loadMoreBtn.setAttribute('disabled', 'true')
                    }
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Load More Tools
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
