
import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { bookQuerySchema, slugSchema } from "./catalog.schemas";

const catalogRouter = Router();

// GET /api/categories
catalogRouter.get("/categories", async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        books: {
          some: { isPublished: true },
        },
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            books: { where: { isPublished: true } },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/books?search=bible&page=1&limit=12
// Optional filters: category=orthodox-books&type=DIGITAL
catalogRouter.get("/books", async (req, res, next) => {
  try {
    const parsed = bookQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid book search parameters",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const { search, category, type, page, limit } = parsed.data;

    const where: Prisma.BookWhereInput = {
      isPublished: true,
      ...(type ? { bookType: type } : {}),
      ...(category
        ? { category: { slug: category } }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { author: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [books, total] = await prisma.$transaction([
      prisma.book.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          author: true,
          description: true,
          coverImage: true,
          bookType: true,
          digitalPrice: true,
          physicalPrice: true,
          stockQuantity: true,
          language: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          createdAt: true,
        },
      }),
      prisma.book.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/books/:slug
catalogRouter.get("/books/:slug", async (req, res, next) => {
  try {
    const parsed = slugSchema.safeParse(req.params);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid book slug",
      });
      return;
    }

    const book = await prisma.book.findFirst({
      where: {
        slug: parsed.data.slug,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        author: true,
        description: true,
        coverImage: true,
        bookType: true,
        digitalPrice: true,
        physicalPrice: true,
        stockQuantity: true,
        language: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
        createdAt: true,
      },
    });

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
});

export default catalogRouter;
