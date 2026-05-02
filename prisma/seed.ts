import { PrismaClient } from "@prisma/client"
import { createClient } from "@supabase/supabase-js"

const prisma = new PrismaClient()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── Skills data ────────────────────────────────────────────────────────────────

const SKILLS = [
  // PROGRAMMING
  { name: "WordPress", slug: "wordpress", track: "PROGRAMMING", category: "CMS" },
  { name: "React", slug: "react", track: "PROGRAMMING", category: "Frontend" },
  { name: "Next.js", slug: "nextjs", track: "PROGRAMMING", category: "Frontend" },
  { name: "HTML & CSS", slug: "html-css", track: "PROGRAMMING", category: "Frontend" },
  { name: "JavaScript", slug: "javascript", track: "PROGRAMMING", category: "Frontend" },
  { name: "Python", slug: "python", track: "PROGRAMMING", category: "Backend" },
  { name: "PHP", slug: "php", track: "PROGRAMMING", category: "Backend" },
  { name: "MySQL", slug: "mysql", track: "PROGRAMMING", category: "Database" },
  { name: "Website maintenance", slug: "website-maintenance", track: "PROGRAMMING", category: "CMS" },
  { name: "SEO optimisation", slug: "seo-optimisation", track: "PROGRAMMING", category: "Marketing" },

  // CREATIVE_DESIGN
  { name: "Figma", slug: "figma", track: "CREATIVE_DESIGN", category: "Design Tools" },
  { name: "Adobe Illustrator", slug: "adobe-illustrator", track: "CREATIVE_DESIGN", category: "Design Tools" },
  { name: "Adobe Photoshop", slug: "adobe-photoshop", track: "CREATIVE_DESIGN", category: "Design Tools" },
  { name: "Canva", slug: "canva", track: "CREATIVE_DESIGN", category: "Design Tools" },
  { name: "Brand identity", slug: "brand-identity", track: "CREATIVE_DESIGN", category: "Branding" },
  { name: "Social media graphics", slug: "social-media-graphics", track: "CREATIVE_DESIGN", category: "Marketing" },
  { name: "Presentation design", slug: "presentation-design", track: "CREATIVE_DESIGN", category: "Business" },
  { name: "Video editing", slug: "video-editing", track: "CREATIVE_DESIGN", category: "Video" },
  { name: "Motion graphics", slug: "motion-graphics", track: "CREATIVE_DESIGN", category: "Video" },
  { name: "UI/UX design", slug: "ui-ux-design", track: "CREATIVE_DESIGN", category: "Design" },

  // TRANSLATION
  { name: "Dari translation", slug: "dari-translation", track: "TRANSLATION", category: "Translation" },
  { name: "Pashto translation", slug: "pashto-translation", track: "TRANSLATION", category: "Translation" },
  { name: "English to Dari", slug: "english-to-dari", track: "TRANSLATION", category: "Translation" },
  { name: "Dari to English", slug: "dari-to-english", track: "TRANSLATION", category: "Translation" },
  { name: "Subtitling", slug: "subtitling", track: "TRANSLATION", category: "Localisation" },
  { name: "Transcription", slug: "transcription", track: "TRANSLATION", category: "Localisation" },
  { name: "Legal translation", slug: "legal-translation", track: "TRANSLATION", category: "Specialised" },
  { name: "Localisation", slug: "localisation", track: "TRANSLATION", category: "Localisation" },
  { name: "Proofreading", slug: "proofreading", track: "TRANSLATION", category: "Editing" },
  { name: "Farsi translation", slug: "farsi-translation", track: "TRANSLATION", category: "Translation" },

  // RESEARCH_DATA
  { name: "Market research", slug: "market-research", track: "RESEARCH_DATA", category: "Research" },
  { name: "Donor mapping", slug: "donor-mapping", track: "RESEARCH_DATA", category: "NGO" },
  { name: "Literature review", slug: "literature-review", track: "RESEARCH_DATA", category: "Academic" },
  { name: "Data entry", slug: "data-entry", track: "RESEARCH_DATA", category: "Data" },
  { name: "Data cleaning", slug: "data-cleaning", track: "RESEARCH_DATA", category: "Data" },
  { name: "Excel & Google Sheets", slug: "excel-sheets", track: "RESEARCH_DATA", category: "Data" },
  { name: "Survey design", slug: "survey-design", track: "RESEARCH_DATA", category: "Research" },
  { name: "Report writing", slug: "report-writing", track: "RESEARCH_DATA", category: "Writing" },
  { name: "Grant research", slug: "grant-research", track: "RESEARCH_DATA", category: "NGO" },
  { name: "Qualitative analysis", slug: "qualitative-analysis", track: "RESEARCH_DATA", category: "Research" },
] as const

// ── Test users ─────────────────────────────────────────────────────────────────

const TEST_USERS = [
  {
    email: "admin@sheconnects.work",
    password: "Admin1234!",
    role: "ADMIN" as const,
  },
  {
    email: "client@test.com",
    password: "Client1234!",
    role: "CLIENT" as const,
  },
  {
    email: "freelancer@test.com",
    password: "Freelancer1234!",
    role: "FREELANCER" as const,
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

async function createSupabaseUser(email: string, password: string): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase.auth.admin as any).listUsers()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const found = existing?.users?.find((u: any) => u.email === email)

    if (found) {
      console.log(`  ↩ Supabase auth user already exists: ${email}`)
      return true
    }

    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      console.log(`  ⚠ Could not create Supabase auth user ${email}: ${error.message}`)
      console.log(`    → Create it manually: Supabase dashboard → Authentication → Users → Add user`)
      return false
    }

    console.log(`  ✓ Created Supabase auth user: ${email}`)
    return true
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.log(`  ⚠ Supabase admin API error for ${email}: ${message}`)
    console.log(`    → Create manually: Supabase dashboard → Authentication → Users → Add user`)
    return false
  }
}

// ── Main seed ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding SheConnects database…\n")

  // 1. Skills
  console.log("📚 Creating skills…")
  for (const skill of SKILLS) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {},
      create: {
        name: skill.name,
        slug: skill.slug,
        track: skill.track,
        category: skill.category,
      },
    })
  }
  console.log(`  ✓ ${SKILLS.length} skills created\n`)

  // 2. Test users
  console.log("👤 Creating test users…")

  for (const testUser of TEST_USERS) {
    await createSupabaseUser(testUser.email, testUser.password)

    const existing = await prisma.user.findUnique({
      where: { email: testUser.email },
      include: { freelancer: true },
    })

    if (existing) {
      console.log(`  ↩ DB user already exists: ${testUser.email}`)
      // Ensure freelancer record matches the current spec
      if (testUser.role === "FREELANCER" && existing.freelancer && existing.freelancer.alias !== "Aaida K.") {
        await prisma.freelancer.update({
          where: { userId: existing.id },
          data: { alias: "Aaida K.", aliasSlug: "aaida-k", track: "PROGRAMMING", status: "APPLIED" },
        })
        console.log(`  ✓ Updated freelancer: alias=Aaida K., track=PROGRAMMING`)
      }
      continue
    }

    if (testUser.role === "ADMIN") {
      await prisma.user.create({
        data: { email: testUser.email, role: "ADMIN", status: "ACTIVE" },
      })
    }

    if (testUser.role === "CLIENT") {
      await prisma.user.create({
        data: {
          email: testUser.email,
          role: "CLIENT",
          status: "ACTIVE",
          client: {
            create: {
              organizationName: "Test Organisation",
              organizationType: "ngo",
              billingCountry: "IT",
            },
          },
        },
      })
    }

    if (testUser.role === "FREELANCER") {
      await prisma.user.create({
        data: {
          email: testUser.email,
          role: "FREELANCER",
          status: "ACTIVE",
          freelancer: {
            create: {
              alias: "Aaida K.",
              aliasSlug: "aaida-k",
              track: "PROGRAMMING",
              status: "APPLIED",
              tagline: "Test freelancer account — web development",
              bio: "This is a test account for the SheConnects platform.",
            },
          },
        },
      })
    }

    console.log(`  ✓ Created: ${testUser.email} (${testUser.role})`)
  }

  console.log("\n✅ Seed complete!")
  console.log("\nTest credentials:")
  console.log("  Admin:      admin@sheconnects.work / Admin1234!")
  console.log("  Client:     client@test.com / Client1234!")
  console.log("  Freelancer: freelancer@test.com / Freelancer1234!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
