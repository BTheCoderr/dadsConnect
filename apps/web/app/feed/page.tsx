"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import ContentCard from "@/components/content-card"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon, BookmarkIcon, TrendingUpIcon, UsersIcon } from "lucide-react"
import ArticleModal from "@/components/article-modal"

interface ContentItem {
  id: string
  source: string
  title: string
  image: string
  excerpt: string
  readTime: string
}

export default function FeedPage() {
  const [feed, setFeed] = useState<ContentItem[]>([])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [savedItems, setSavedItems] = useState<ContentItem[]>([])
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<ContentItem | null>(null)

  useEffect(() => {
    fetch("/api/feed", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const normalized = (data.items ?? []).map((i: any) => ({
          id: i.id,
          source: i.sourceId ?? "",
          title: i.title,
          image: i.image ?? "/placeholder-vk2kx.png",
          excerpt: i.excerpt ?? "",
          readTime: `${i.readTime ?? 5} min`,
        }))
        setFeed(normalized)
      })
      .catch(() => {})
  }, [])

  const currentCard = feed[currentIndex]

  const handleSave = (id: string) => {
    console.log(`Saved item: ${id}`)
    const itemToSave = feed.find((item) => item.id === id)
    if (itemToSave && !savedItems.some((item) => item.id === id)) {
      setSavedItems((prev) => [...prev, itemToSave])
    }
    moveToNextCard()
  }

  const handleSkip = (id: string) => {
    console.log(`Skipped item: ${id}`)
    moveToNextCard()
  }

  const handleTap = (id: string) => {
    const article = feed.find((item) => item.id === id)
    if (article) {
      setSelectedArticle(article)
      setIsArticleModalOpen(true)
    }
  }

  const handleCloseArticleModal = () => {
    setIsArticleModalOpen(false)
    setSelectedArticle(null)
  }

  const moveToNextCard = () => {
    if (currentIndex < feed.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      alert("You've reached the end of your current feed! More content coming soon.")
      setCurrentIndex(0)
    }
  }

  const trendingTopics = [
    "Sleep Training",
    "Toddler Nutrition",
    "Work-Life Balance",
    "Outdoor Activities",
    "Dad Mental Health",
  ]

  const suggestedGroups = [
    { name: "New Dads Support", members: 1247, topic: "First-time fathers" },
    { name: "Single Dads Unite", members: 892, topic: "Single parenting" },
    { name: "Adventure Dads", members: 2156, topic: "Outdoor activities" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">DadConnect</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <SearchIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <BookmarkIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Trending & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Topics */}
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <TrendingUpIcon className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="font-semibold text-gray-900">Trending Topics</h3>
              </div>
              <div className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <button
                    key={index}
                    className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                  >
                    #{topic}
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Your Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Articles Saved</span>
                  <span className="text-sm font-medium">{savedItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Articles Read</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Groups Joined</span>
                  <span className="text-sm font-medium">3</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Feed Area */}
          <div className="lg:col-span-2">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Daily Feed</h2>
              <p className="text-gray-600">Discover content tailored to your interests</p>
            </div>

            {/* Content Card */}
            <div className="flex justify-center mb-6">
              <div className="w-full max-w-sm">
                {currentCard ? (
                  <ContentCard
                    key={currentCard.id}
                    {...currentCard}
                    onSave={handleSave}
                    onSkip={handleSkip}
                    onTap={handleTap}
                  />
                ) : (
                  <Card className="flex h-[400px] w-full items-center justify-center text-center text-gray-500">
                    <div>
                      <p className="text-lg mb-2">No more content in your feed</p>
                      <p className="text-sm">Check back later for more articles!</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant="outline"
                onClick={() => handleSkip(currentCard?.id || "")}
                disabled={!currentCard}
                className="bg-white"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Skip
              </Button>
              <Button onClick={() => handleSave(currentCard?.id || "")} disabled={!currentCard}>
                <ArrowRightIcon className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>

            {/* Progress Indicator */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                Article {currentIndex + 1} of {feed.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / feed.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Groups & Community */}
          <div className="lg:col-span-1 space-y-6">
            {/* Suggested Groups */}
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <UsersIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-semibold text-gray-900">Suggested Groups</h3>
              </div>
              <div className="space-y-3">
                {suggestedGroups.map((group, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <h4 className="font-medium text-sm text-gray-900">{group.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{group.topic}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{group.members} members</span>
                      <Button size="sm" variant="outline" className="text-xs h-6 px-2 bg-transparent">
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-3 text-sm">
                View All Groups
              </Button>
            </Card>

            {/* Call to Action */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Join the Community</h3>
              <p className="text-sm text-gray-600 mb-3">
                Connect with other dads, share experiences, and get support when you need it most.
              </p>
              <Button className="w-full" size="sm">
                Explore Groups
              </Button>
            </Card>
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

      <ArticleModal isOpen={isArticleModalOpen} onClose={handleCloseArticleModal} article={selectedArticle} />
    </div>
  )
}
