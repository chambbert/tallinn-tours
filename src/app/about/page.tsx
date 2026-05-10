import Link from 'next/link'
import { MapPin, Heart, Users, Star, Award, Mail, Phone } from 'lucide-react'

export const metadata = {
  title: 'About Us — Tallinn Tours',
  description: 'Meet the passionate local guides behind Tallinn Tours. Founded 2018, we share authentic stories of Estonia\'s medieval capital.',
}

const guides = [
  {
    name: 'Ingrid Tammaru',
    role: 'Co-Founder',
    specialty: 'Medieval History & Old Town',
    bio: 'Ingrid grew up in the shadow of Toompea and has spent her life uncovering the hidden stories written into every cobblestone and guild hall of Tallinn\'s Old Town. She co-founded Tallinn Tours to share the city she loves with visitors who want more than a surface-level experience.',
    initial: 'I',
    tours: ['Old Town Walking Tour', 'History Deep Dive', 'Towers & Walls Tour'],
  },
  {
    name: 'Liis Veskimäe',
    role: 'Co-Founder',
    specialty: 'Evening Tours & Local Culture',
    bio: 'Liis is a born storyteller with a gift for bringing Tallinn\'s darker legends and vibrant neighbourhood culture to life after dark. She co-founded Tallinn Tours with a vision to create intimate, locally rooted experiences that linger long after guests leave Estonia.',
    initial: 'L',
    tours: ['Evening Legends & Ghost Tour', 'Kalamaja Adventure', 'Twilight Old Town Walk'],
  },
]

const values = [
  {
    icon: <Heart size={28} className="text-[#c9a84c]" />,
    title: 'Authentic Connection',
    desc: 'We believe travel is most meaningful when it creates genuine human connections. Every tour is a conversation, not a performance.',
  },
  {
    icon: <Star size={28} className="text-[#c9a84c]" />,
    title: 'Uncompromising Quality',
    desc: 'Small groups, expert guides, meticulous research. We\'d rather run fewer tours and do them exceptionally well than scale at the cost of quality.',
  },
  {
    icon: <Award size={28} className="text-[#c9a84c]" />,
    title: 'Local Pride',
    desc: 'We are Tallinn people sharing our home city. Every story we tell comes from genuine love for this extraordinary place.',
  },
]

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* HERO */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1623] via-[#1a2235] to-[#0f1623]" />
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c9a84c]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#c9a84c] text-sm font-medium mb-6">
            <MapPin size={14} />
            <span>Est. 2018 · Tallinn, Estonia</span>
          </div>
          <h1
            className="text-5xl sm:text-6xl font-bold text-white font-serif mb-6"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            We Are Tallinn
          </h1>
          <p className="text-xl text-[#8892a4] max-w-2xl mx-auto leading-relaxed">
            A team of passionate locals on a mission to share the authentic soul of the most
            surprisingly magical city in the Baltic.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-12 bg-[#c9a84c]/50" />
                <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">
                  Our Story
                </span>
              </div>
              <h2
                className="text-3xl font-bold text-white font-serif mb-6"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
              >
                How It All Began
              </h2>
              <div className="space-y-4 text-[#8892a4] leading-relaxed">
                <p>
                  In 2018, Maris and Kaarel — both Tallinn locals who had spent years watching
                  tourists shuffle past the city&apos;s greatest secrets — had a simple idea: what
                  if someone actually showed them?
                </p>
                <p>
                  They launched Tallinn Tours with two walking routes, one camera, and an
                  obsessive commitment to sharing the stories that textbooks leave out. Within
                  months, guests were calling it the highlight of their entire trip.
                </p>
                <p>
                  Today, our team of eight guides — all Tallinn born and raised — runs tours
                  that have been featured in travel publications across Europe. But nothing
                  has changed about our approach: small groups, real stories, genuine passion.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6">
                <div
                  className="text-[#c9a84c] text-5xl font-bold font-serif mb-2"
                  style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                >
                  2018
                </div>
                <p className="text-[#8892a4] text-sm">Year Tallinn Tours was founded</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-5 text-center">
                  <div
                    className="text-[#c9a84c] text-3xl font-bold font-serif mb-1"
                    style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                  >
                    500+
                  </div>
                  <p className="text-[#8892a4] text-xs">Happy Guests</p>
                </div>
                <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-5 text-center">
                  <div
                    className="text-[#c9a84c] text-3xl font-bold font-serif mb-1"
                    style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                  >
                    4.9★
                  </div>
                  <p className="text-[#8892a4] text-xs">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 bg-[#1a2235] border-y border-[#232d42]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-[#c9a84c]/50" />
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">
                What Drives Us
              </span>
              <div className="h-px w-16 bg-[#c9a84c]/50" />
            </div>
            <h2
              className="text-3xl font-bold text-white font-serif"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              Our Mission & Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-[#0f1623] border border-[#232d42] rounded-2xl p-6 hover:border-[#c9a84c]/40 transition-colors"
              >
                <div className="mb-4">{v.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-3">{v.title}</h3>
                <p className="text-[#8892a4] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-[#c9a84c]/50" />
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">
                The Team
              </span>
              <div className="h-px w-16 bg-[#c9a84c]/50" />
            </div>
            <h2
              className="text-3xl font-bold text-white font-serif"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              Meet Your Guides
            </h2>
            <p className="text-[#8892a4] mt-3">
              All born and raised in Tallinn. All genuinely obsessed with sharing its stories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <div
                key={guide.name}
                className="bg-[#1a2235] border border-[#232d42] rounded-2xl overflow-hidden hover:border-[#c9a84c]/40 transition-colors"
              >
                <div className="h-40 bg-gradient-to-br from-[#232d42] to-[#0f1623] flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#c9a84c]/20 border-2 border-[#c9a84c]/40 flex items-center justify-center text-[#c9a84c] text-3xl font-bold font-serif">
                    {guide.initial}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg font-serif">{guide.name}</h3>
                  <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wide mt-0.5 mb-3">
                    {guide.role}
                  </p>
                  <p className="text-[#8892a4] text-sm leading-relaxed mb-4">{guide.bio}</p>
                  <div className="border-t border-[#232d42] pt-3">
                    <p className="text-[#8892a4] text-xs font-medium uppercase tracking-wider mb-2">
                      Speciality
                    </p>
                    <p className="text-white text-sm">{guide.specialty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY LOCAL GUIDES */}
      <section className="py-20 bg-[#1a2235] border-y border-[#232d42]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-white font-serif"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              Why Local Guides Matter
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Lived Experience',
                desc: 'We don\'t just know the facts — we know the old man who sells traditional pastries from his window every Tuesday, the courtyard where local teenagers have met for generations, the view that even most Tallinn residents have never found.',
              },
              {
                title: 'No Rehearsed Script',
                desc: 'Every tour adapts to the group. Curious about a specific period? We go deeper. Want to hear more local legends? We have dozens. Your questions shape the experience.',
              },
              {
                title: 'Community Connection',
                desc: 'Our tours support local businesses, artisans, and food producers. When you book with us, your money stays in Tallinn and directly benefits the community we\'re showing you.',
              },
              {
                title: 'Real Recommendations',
                desc: 'At the end of every tour, we\'ll tell you exactly where we actually eat, drink, and spend our weekends. Not the tourist spots — the real ones.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#0f1623] border border-[#232d42] rounded-2xl p-6"
              >
                <h3 className="text-white font-semibold text-base mb-2 flex items-start gap-2">
                  <span className="text-[#c9a84c] mt-0.5">→</span>
                  {item.title}
                </h3>
                <p className="text-[#8892a4] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TALLINN HISTORY */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-[#c9a84c]/50" />
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">
                The City
              </span>
              <div className="h-px w-16 bg-[#c9a84c]/50" />
            </div>
            <h2
              className="text-3xl font-bold text-white font-serif"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              Tallinn Through the Ages
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { year: '1154', event: 'First recorded mention of Tallinn, then known as Lindanise, on Arab geographer al-Idrisi\'s world map.' },
              { year: '1219', event: 'Danish King Valdemar II conquers the settlement. The name "Tallinn" likely derives from "Taani linn" — Danish castle.' },
              { year: '1285', event: 'Tallinn joins the Hanseatic League, becoming one of the most important trading ports in northern Europe.' },
              { year: '1561', event: 'The city falls under Swedish rule during the Livonian War, beginning a period of relative prosperity.' },
              { year: '1918', event: 'Estonia declares independence. Tallinn becomes the capital of the new republic.' },
              { year: '1991', event: 'Estonia restores independence after Soviet occupation. Tallinn\'s old town begins its remarkable restoration.' },
              { year: '1997', event: 'UNESCO designates Tallinn\'s historic old town a World Heritage Site.' },
            ].map((item) => (
              <div key={item.year} className="flex gap-6 items-start">
                <div className="text-[#c9a84c] font-mono font-bold text-sm w-12 flex-shrink-0 pt-0.5">
                  {item.year}
                </div>
                <div className="flex-1 pb-4 border-b border-[#232d42] last:border-0">
                  <p className="text-[#8892a4] text-sm leading-relaxed">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-[#1a2235] border-t border-[#232d42]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2
            className="text-3xl font-bold text-white font-serif mb-4"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            Get in Touch
          </h2>
          <p className="text-[#8892a4] mb-10 leading-relaxed">
            Questions about a specific tour? Need to arrange a private group booking? We&apos;d
            love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
            <a
              href="mailto:hello@tallinn-tours.com"
              className="flex items-center gap-3 text-[#8892a4] hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#232d42] flex items-center justify-center">
                <Mail size={18} className="text-[#c9a84c]" />
              </div>
              <span>hello@tallinn-tours.com</span>
            </a>
            <a
              href="tel:+3725550100"
              className="flex items-center gap-3 text-[#8892a4] hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#232d42] flex items-center justify-center">
                <Phone size={18} className="text-[#c9a84c]" />
              </div>
              <span>+372 555 0100</span>
            </a>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/tours"
              className="px-8 py-3.5 bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-semibold rounded-full transition-colors"
            >
              Browse Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
