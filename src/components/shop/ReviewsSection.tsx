import React, { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, CheckCircle, Filter, ChevronDown, User, Camera } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Review, ReviewStats } from '@/types/coffee'

interface ReviewsSectionProps {
  reviews: Review[]
  stats: ReviewStats
  productId: string
  className?: string
}

type SortOption = 'helpful' | 'recent' | 'highest' | 'lowest'
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1' | 'verified'

export default function ReviewsSection({ 
  reviews, 
  stats, 
  productId,
  className = '' 
}: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>('helpful')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set())
  const [unhelpfulReviews, setUnhelpfulReviews] = useState<Set<string>>(new Set())

  // Filter and sort reviews
  const processedReviews = reviews
    .filter(review => {
      if (filterBy === 'all') return true
      if (filterBy === 'verified') return review.verifiedPurchase
      return review.rating.toString() === filterBy
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'helpful':
          return (b.helpful - b.notHelpful) - (a.helpful - a.notHelpful)
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        default:
          return 0
      }
    })

  const renderStars = (rating: number, size: string = 'h-5 w-5') => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              size,
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : i < rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    )
  }

  const handleHelpful = (reviewId: string, isHelpful: boolean) => {
    if (isHelpful) {
      if (helpfulReviews.has(reviewId)) {
        setHelpfulReviews(prev => {
          const next = new Set(prev)
          next.delete(reviewId)
          return next
        })
      } else {
        setHelpfulReviews(prev => new Set(prev).add(reviewId))
        setUnhelpfulReviews(prev => {
          const next = new Set(prev)
          next.delete(reviewId)
          return next
        })
      }
    } else {
      if (unhelpfulReviews.has(reviewId)) {
        setUnhelpfulReviews(prev => {
          const next = new Set(prev)
          next.delete(reviewId)
          return next
        })
      } else {
        setUnhelpfulReviews(prev => new Set(prev).add(reviewId))
        setHelpfulReviews(prev => {
          const next = new Set(prev)
          next.delete(reviewId)
          return next
        })
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
            </CardDescription>
          </div>
          <Dialog open={isWritingReview} onOpenChange={setIsWritingReview}>
            <DialogTrigger asChild>
              <Button>Write a Review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your experience with this coffee
                </DialogDescription>
              </DialogHeader>
              <ReviewForm productId={productId} onClose={() => setIsWritingReview(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{stats.averageRating.toFixed(1)}</div>
            {renderStars(stats.averageRating)}
            <p className="text-sm text-muted-foreground mt-1">
              {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating as keyof typeof stats.distribution]
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterBy(rating.toString() as FilterOption)}
                    className="flex items-center gap-1 text-sm hover:underline"
                  >
                    <span>{rating}</span>
                    <Star className="h-3 w-3 fill-current" />
                  </button>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="helpful">Most Helpful</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="verified">Verified Purchases</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {processedReviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No reviews match your filters
            </p>
          ) : (
            processedReviews.map((review) => (
              <div key={review.id} className="space-y-3 pb-4 border-b last:border-0">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.userName}</span>
                          {review.verifiedPurchase && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {renderStars(review.rating, 'h-3 w-3')}
                          <span>•</span>
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-2">
                  {review.title && (
                    <h4 className="font-medium">{review.title}</h4>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                </div>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2">
                    {review.images.map((image, index) => (
                      <div key={index} className="relative h-16 w-16 rounded overflow-hidden">
                        <img src={image} alt={`Review image ${index + 1}`} className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Buttons */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Helpful?</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id, true)}
                      className={cn(
                        "h-8",
                        helpfulReviews.has(review.id) && "text-primary"
                      )}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id, false)}
                      className={cn(
                        "h-8",
                        unhelpfulReviews.has(review.id) && "text-destructive"
                      )}
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      {review.notHelpful + (unhelpfulReviews.has(review.id) ? 1 : 0)}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {reviews.length > 5 && processedReviews.length > 5 && (
          <Button variant="outline" className="w-full">
            <ChevronDown className="h-4 w-4 mr-2" />
            Load More Reviews
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Review Form Component
function ReviewForm({ productId, onClose }: { productId: string; onClose: () => void }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  return (
    <div className="space-y-4">
      {/* Rating Selection */}
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(value)}
              className="p-1"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  (hoveredRating || rating) >= value
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Review Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Review Title</Label>
        <Input
          id="title"
          placeholder="Summarize your experience"
          className="w-full"
        />
      </div>

      {/* Review Text */}
      <div className="space-y-2">
        <Label htmlFor="comment">Your Review</Label>
        <Textarea
          id="comment"
          placeholder="Share your thoughts about this coffee..."
          className="min-h-[100px]"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Photos (optional)</Label>
        <Button variant="outline" className="w-full">
          <Camera className="h-4 w-4 mr-2" />
          Add Photos
        </Button>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Submit Review</Button>
      </DialogFooter>
    </div>
  )
}