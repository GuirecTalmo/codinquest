import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getQuizForUser } from "@/lib/data/quiz";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier que l'utilisateur est authentifié
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const result = await getQuizForUser(id, session.user.id as string);

    if (result.status === "not_found") {
      return NextResponse.json({ error: "Quiz non trouvé" }, { status: 404 });
    }

    if (result.status === "forbidden") {
      return NextResponse.json(
        { error: "Division insuffisante pour accéder à ce quiz" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      quiz: result.quiz,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du quiz:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération du quiz" },
      { status: 500 }
    );
  }
}
