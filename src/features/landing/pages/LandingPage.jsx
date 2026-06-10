import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import HowItWorksSection from '../components/HowItWorksSection'
import LandingCTA from '../components/LandingCTA'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <LandingCTA />
    </main>
  )
}
