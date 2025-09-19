import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Loader2, User, Mail, Lock, MapPin, Coffee } from 'lucide-react'

const accountSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const profileSchema = z.object({
  phone: z.string().optional(),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(5, 'Postal code is required'),
    country: z.string().min(2, 'Country is required')
  }),
  coffeePreferences: z.array(z.string()).optional(),
  newsletter: z.boolean().default(false)
})

const preferencesSchema = z.object({
  favoriteBrewMethod: z.string().optional(),
  roastPreference: z.string().optional(),
  flavorNotes: z.array(z.string()).optional(),
  subscriptionFrequency: z.string().optional()
})

type AccountFormValues = z.infer<typeof accountSchema>
type ProfileFormValues = z.infer<typeof profileSchema>
type PreferencesFormValues = z.infer<typeof preferencesSchema>

interface RegisterFormProps {
  onSubmit: (data: AccountFormValues & ProfileFormValues & PreferencesFormValues) => Promise<void>
  isLoading?: boolean
  error?: string
}

export default function RegisterForm({ onSubmit, isLoading = false, error }: RegisterFormProps) {
  const [step, setStep] = useState(1)
  const [accountData, setAccountData] = useState<AccountFormValues | null>(null)
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(null)

  const steps = [
    { id: 1, title: 'Account', icon: User },
    { id: 2, title: 'Profile', icon: MapPin },
    { id: 3, title: 'Preferences', icon: Coffee }
  ]

  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  })

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      coffeePreferences: [],
      newsletter: false
    }
  })

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      favoriteBrewMethod: '',
      roastPreference: '',
      flavorNotes: [],
      subscriptionFrequency: ''
    }
  })

  const handleAccountSubmit = (data: AccountFormValues) => {
    setAccountData(data)
    setStep(2)
  }

  const handleProfileSubmit = (data: ProfileFormValues) => {
    setProfileData(data)
    setStep(3)
  }

  const handleFinalSubmit = async (data: PreferencesFormValues) => {
    if (accountData && profileData) {
      await onSubmit({
        ...accountData,
        ...profileData,
        ...data
      })
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto claymorphism-card">
      <CardHeader className="space-y-4">
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join Honduras Coffee for exclusive access to premium mountain-grown beans
        </CardDescription>

        <div className="space-y-2">
          <div className="flex justify-between">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`flex items-center ${s.id < step ? 'text-primary' : s.id === step ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                <s.icon className={`h-4 w-4 ${s.id <= step ? 'text-primary' : ''}`} />
                <span className="ml-2 text-sm font-medium hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
          <Progress value={(step / steps.length) * 100} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {step} of {steps.length}</span>
            <Badge variant="outline">{Math.round((step / steps.length) * 100)}%</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <Form {...accountForm}>
            <form onSubmit={accountForm.handleSubmit(handleAccountSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={accountForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={accountForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={accountForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Create a password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm your password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountForm.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        I agree to the{' '}
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Terms of Service
                        </Button>{' '}
                        and{' '}
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Privacy Policy
                        </Button>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Continue to Profile
              </Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Shipping Address</FormLabel>
                <FormField
                  control={profileForm.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Street Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="address.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Postal Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={profileForm.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        Subscribe to our newsletter for exclusive offers and coffee updates
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Continue to Preferences
                </Button>
              </div>
            </form>
          </Form>
        )}

        {step === 3 && (
          <Form {...preferencesForm}>
            <form onSubmit={preferencesForm.handleSubmit(handleFinalSubmit)} className="space-y-4">
              <FormField
                control={preferencesForm.control}
                name="favoriteBrewMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favorite Brewing Method (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preferred method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="espresso">Espresso</SelectItem>
                        <SelectItem value="pour-over">Pour Over</SelectItem>
                        <SelectItem value="french-press">French Press</SelectItem>
                        <SelectItem value="aeropress">AeroPress</SelectItem>
                        <SelectItem value="cold-brew">Cold Brew</SelectItem>
                        <SelectItem value="drip">Drip Coffee</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={preferencesForm.control}
                name="roastPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roast Preference (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preferred roast" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light Roast</SelectItem>
                        <SelectItem value="medium-light">Medium-Light Roast</SelectItem>
                        <SelectItem value="medium">Medium Roast</SelectItem>
                        <SelectItem value="medium-dark">Medium-Dark Roast</SelectItem>
                        <SelectItem value="dark">Dark Roast</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={preferencesForm.control}
                name="subscriptionFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interested in Subscription? (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Not interested right now</SelectItem>
                        <SelectItem value="weekly">Weekly Delivery</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly Delivery</SelectItem>
                        <SelectItem value="monthly">Monthly Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}

        <Separator className="my-4" />

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Button variant="link" className="p-0 h-auto">
            Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}