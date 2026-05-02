/**
 * Migration script: import Gita, Zahra, and Farwa from the static marketing
 * site into the platform database.
 *
 * Usage:
 *   pnpm dotenv -e .env.local -- tsx scripts/migrate-existing-freelancers.ts
 *
 * This script is IDEMPOTENT — safe to run multiple times. It uses upsert so
 * re-running it will update existing records rather than creating duplicates.
 *
 * After running:
 *   - Update each freelancer's email in the DB to their real email address
 *     once they sign up via /app/apply (or the admin creates their account).
 *   - Upload portfolio files to R2 and link them to the PortfolioItem records.
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ── Freelancer data ────────────────────────────────────────────────────────────

const FREELANCERS = [
  {
    // Placeholder email — update to Gita's real email when she signs up
    email: "gita-migrated@sheconnects.work",
    alias: "Gita",
    aliasSlug: "gita",
    track: "TRANSLATION" as const,
    tagline: "Document Translation Specialist",
    bio: "My name is Gita. I am a freelance document translator working between English, Dari, and Uzbeki. I have a background in research, journalism, and women's rights documentation, which gave me strong writing and analytical skills. Due to serious security risks and restrictions on women's work in Afghanistan, I migrated to Pakistan. I now work remotely, focusing on accurate, professional, and confidential document translation to support myself and my family.",
    displayCity: null,
    displayCountry: "Pakistan",
    showCity: false,
    showCountry: true,
    languages: [
      { language: "English",  proficiency: "FLUENT" as const },
      { language: "Dari",     proficiency: "NATIVE" as const },
      { language: "Uzbeki",   proficiency: "FLUENT" as const },
    ],
    skillSlugs: [
      "dari-translation",
      "english-to-dari",
      "dari-to-english",
      "proofreading",
    ],
    portfolio: [
      {
        title: "English to Dari Translation Sample",
        description: "Sample of technical translation from English to Dari. Demonstrates accuracy, formatting, and confidential document handling.",
        displayOrder: 0,
      },
      {
        title: "Dari to English Translation Sample",
        description: "Sample of technical translation from Dari to English. Shows fluency in both languages and attention to tone.",
        displayOrder: 1,
      },
    ],
  },

  {
    // Placeholder email — update to Zahra's real email when she signs up
    email: "zahra-migrated@sheconnects.work",
    alias: "Zahra",
    aliasSlug: "zahra",
    track: "TRANSLATION" as const,
    tagline: "Document Translator & Online Educator",
    bio: "Zahra is a professional translator and educator proficient in English and Dari. With a background in academic writing and international debates, she possesses strong communication and digital skills. Currently working as an online educator, she specialises in teaching school subjects and preparing professional documents. She seeks remote opportunities due to restrictions on women's work in Afghanistan.",
    displayCity: null,
    displayCountry: null,
    showCity: false,
    showCountry: false,
    languages: [
      { language: "English",  proficiency: "FLUENT" as const },
      { language: "Dari",     proficiency: "NATIVE" as const },
    ],
    skillSlugs: [
      "dari-translation",
      "english-to-dari",
      "dari-to-english",
      "transcription",
      "proofreading",
    ],
    portfolio: [
      {
        title: "Professional Resume",
        description: "Professional background and qualifications covering academic writing, translation, and online education.",
        displayOrder: 0,
      },
      {
        title: "English to Dari Translation Sample",
        description: "A sample of professional translation work demonstrating accuracy and cultural sensitivity.",
        displayOrder: 1,
      },
      {
        title: "Lesson Presentation Sample",
        description: "Academic materials prepared for online teaching of school subjects, designed for clarity and engagement.",
        displayOrder: 2,
      },
      {
        title: "Digital Document Design",
        description: "Example of professional document formatting and design — showing attention to layout and readability.",
        displayOrder: 3,
      },
    ],
  },

  {
    // Placeholder email — update to Farwa's real email when she signs up
    email: "farwa-migrated@sheconnects.work",
    alias: "Farwa",
    aliasSlug: "farwa",
    track: "TRANSLATION" as const,
    tagline: "Online Persian (Dari) Teacher & Translator",
    bio: "Farwa is an online Persian (Dari) language teacher for non-native learners, using English to explain vocabulary, pronunciation, and basic conversation. She creates beginner-friendly lessons focused on practical communication and learner confidence. Due to current restrictions in Afghanistan, she is seeking remote teaching opportunities.",
    displayCity: null,
    displayCountry: null,
    showCity: false,
    showCountry: false,
    languages: [
      { language: "English",  proficiency: "FLUENT" as const },
      { language: "Dari",     proficiency: "NATIVE" as const },
    ],
    skillSlugs: [
      "dari-translation",
      "english-to-dari",
      "localisation",
    ],
    portfolio: [
      {
        title: "Online Teaching Demonstration",
        description: "A video demonstration of teaching style and bilingual instruction methods, showing how Dari is taught to English-speaking beginners.",
        displayOrder: 0,
      },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function log(msg: string) { console.log(msg) }
function warn(msg: string) { console.log(`  ⚠ ${msg}`) }
function ok(msg: string)   { console.log(`  ✓ ${msg}`) }
function skip(msg: string) { console.log(`  ↩ ${msg}`) }

// ── Main ───────────────────────────────────────────────────────────────────────

async function migrate() {
  log("\n🌱 Migrating existing freelancers into the platform DB…\n")

  for (const f of FREELANCERS) {
    log(`── ${f.alias} (${f.aliasSlug}) ────────────────────`)

    // 1. Upsert User
    const user = await prisma.user.upsert({
      where:  { email: f.email },
      update: { status: "ACTIVE", role: "FREELANCER" },
      create: { email: f.email, role: "FREELANCER", status: "ACTIVE" },
    })
    ok(`User: ${user.email} (id: ${user.id})`)

    // 2. Upsert Freelancer
    const freelancer = await prisma.freelancer.upsert({
      where:  { userId: user.id },
      update: {
        alias: f.alias,
        aliasSlug: f.aliasSlug,
        track: f.track,
        tagline: f.tagline,
        bio: f.bio,
        displayCity: f.displayCity,
        displayCountry: f.displayCountry,
        showCity: f.showCity,
        showCountry: f.showCountry,
        status: "ACTIVE",
        acceptingOffers: true,
      },
      create: {
        userId: user.id,
        alias: f.alias,
        aliasSlug: f.aliasSlug,
        track: f.track,
        tagline: f.tagline,
        bio: f.bio,
        displayCity: f.displayCity,
        displayCountry: f.displayCountry,
        showCity: f.showCity,
        showCountry: f.showCountry,
        status: "ACTIVE",
        acceptingOffers: true,
      },
    })
    ok(`Freelancer record: status=ACTIVE, acceptingOffers=true`)

    // 3. Languages — replace all
    await prisma.freelancerLanguage.deleteMany({ where: { freelancerId: freelancer.id } })
    await prisma.freelancerLanguage.createMany({
      data: f.languages.map((l) => ({
        freelancerId: freelancer.id,
        language: l.language,
        proficiency: l.proficiency,
      })),
    })
    ok(`Languages: ${f.languages.map((l) => `${l.language} (${l.proficiency})`).join(", ")}`)

    // 4. Skills — look up by slug, replace all
    await prisma.freelancerSkill.deleteMany({ where: { freelancerId: freelancer.id } })

    const skills = await prisma.skill.findMany({
      where: { slug: { in: f.skillSlugs } },
      select: { id: true, slug: true, name: true },
    })

    const foundSlugs = new Set(skills.map((s) => s.slug))
    for (const slug of f.skillSlugs) {
      if (!foundSlugs.has(slug)) {
        warn(`Skill slug not found in DB: "${slug}" — run pnpm db:seed first`)
      }
    }

    if (skills.length > 0) {
      await prisma.freelancerSkill.createMany({
        data: skills.map((s, i) => ({
          freelancerId: freelancer.id,
          skillId: s.id,
          level: "INTERMEDIATE" as const,
          isPrimary: i === 0,
        })),
      })
      ok(`Skills: ${skills.map((s) => s.name).join(", ")}`)
    }

    // 5. Portfolio items — upsert by title
    for (const item of f.portfolio) {
      const existing = await prisma.portfolioItem.findFirst({
        where: { freelancerId: freelancer.id, title: item.title },
      })

      if (existing) {
        await prisma.portfolioItem.update({
          where: { id: existing.id },
          data: { description: item.description, displayOrder: item.displayOrder },
        })
        skip(`Portfolio item already exists: "${item.title}"`)
      } else {
        await prisma.portfolioItem.create({
          data: {
            freelancerId: freelancer.id,
            title: item.title,
            description: item.description,
            displayOrder: item.displayOrder,
            isAnonymised: false,
            clientNameRedacted: true,
            isPublic: true,
          },
        })
        ok(`Portfolio item created: "${item.title}"`)
      }
    }

    log("")
  }

  log("✅ Migration complete!\n")
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  log("📋 MANUAL FOLLOW-UP REQUIRED")
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
  log("1. UPDATE EMAILS — when each freelancer signs up, change their DB")
  log("   email from the placeholder to their real Supabase auth email:")
  for (const f of FREELANCERS) {
    log(`   ${f.alias}: UPDATE "User" SET email = '<real>' WHERE email = '${f.email}';`)
  }
  log("")
  log("2. UPLOAD PORTFOLIO FILES to Cloudflare R2 and link them to the")
  log("   PortfolioItem records. Current static files are at:")
  log("   /public/portfolio/ (still served by the marketing site)")
  log("")
  log("3. VERIFY in the platform admin (/app/admin) that all three")
  log("   freelancers appear with status=ACTIVE.\n")
}

migrate()
  .catch((e) => {
    console.error("\n❌ Migration failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
