
import { PrismaClient, BookType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Evangadi Book Store database seeding...");

  // 1. Create categories
  const categoryData = [
    {
      name: "Orthodox Christian Books",
      slug: "orthodox-christian-books",
      description:
        "Books about Ethiopian Orthodox Tewahedo faith, spirituality, and tradition.",
    },
    {
      name: "Religious and Spiritual Books",
      slug: "religious-spiritual-books",
      description: "Books about faith, spiritual growth, and religious study.",
    },
    {
      name: "Education and Learning",
      slug: "education-learning",
      description: "Educational books and learning resources for students.",
    },
    {
      name: "Fiction and Literature",
      slug: "fiction-literature",
      description: "Novels, stories, and literary works.",
    },
    {
      name: "Technology and Programming",
      slug: "technology-programming",
      description: "Books about software development and technology.",
    },
  ];

  const categories = await Promise.all(
    categoryData.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
        },
        create: category,
      }),
    ),
  );

  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category.id]),
  );

  // 2. Create sample books
  const books = [
    {
      title: "Introduction to Ethiopian Orthodox Christianity",
      slug: "introduction-ethiopian-orthodox-christianity",
      author: "Evangadi Book Store Editorial Team",
      description:
        "An introductory learning resource about Ethiopian Orthodox Christian traditions, worship, and spiritual life.",
      categorySlug: "orthodox-christian-books",
      bookType: BookType.BOTH,
      digitalPrice: "150.00",
      physicalPrice: "350.00",
      stockQuantity: 20,
      language: "en",
    },
    {
      title: "Foundations of Spiritual Growth",
      slug: "foundations-of-spiritual-growth",
      author: "Evangadi Book Store Editorial Team",
      description:
        "A sample resource for readers interested in spiritual reflection and personal growth.",
      categorySlug: "religious-spiritual-books",
      bookType: BookType.DIGITAL,
      digitalPrice: "120.00",
      physicalPrice: null,
      stockQuantity: 0,
      language: "en",
    },
    {
      title: "Study Skills for Secondary School Students",
      slug: "study-skills-secondary-school",
      author: "Evangadi Book Store Editorial Team",
      description:
        "A sample educational resource covering study planning, revision, and effective learning habits.",
      categorySlug: "education-learning",
      bookType: BookType.BOTH,
      digitalPrice: "100.00",
      physicalPrice: "250.00",
      stockQuantity: 30,
      language: "en",
    },
    {
      title: "The Art of Storytelling",
      slug: "the-art-of-storytelling",
      author: "Evangadi Book Store Editorial Team",
      description:
        "A sample literature title exploring storytelling, imagination, and creative writing.",
      categorySlug: "fiction-literature",
      bookType: BookType.PHYSICAL,
      digitalPrice: null,
      physicalPrice: "280.00",
      stockQuantity: 15,
      language: "en",
    },
    {
      title: "Web Development Fundamentals",
      slug: "web-development-fundamentals",
      author: "Evangadi Book Store Editorial Team",
      description:
        "A sample beginner resource covering web development concepts and modern application architecture.",
      categorySlug: "technology-programming",
      bookType: BookType.BOTH,
      digitalPrice: "200.00",
      physicalPrice: "450.00",
      stockQuantity: 12,
      language: "en",
    },
  ];

  for (const book of books) {
    const categoryId = categoryBySlug.get(book.categorySlug);

    if (!categoryId) {
      throw new Error(`Category not found: ${book.categorySlug}`);
    }

    await prisma.book.upsert({
      where: { slug: book.slug },
      update: {
        title: book.title,
        author: book.author,
        description: book.description,
        categoryId,
        bookType: book.bookType,
        digitalPrice: book.digitalPrice,
        physicalPrice: book.physicalPrice,
        stockQuantity: book.stockQuantity,
        language: book.language,
        isPublished: true,
      },
      create: {
        title: book.title,
        slug: book.slug,
        author: book.author,
        description: book.description,
        categoryId,
        bookType: book.bookType,
        digitalPrice: book.digitalPrice,
        physicalPrice: book.physicalPrice,
        stockQuantity: book.stockQuantity,
        language: book.language,
        isPublished: true,
      },
    });
  }

  console.log(`Created or updated ${categories.length} categories.`);
  console.log(`Created or updated ${books.length} sample books.`);
  console.log("Database seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
