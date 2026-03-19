import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export const middleware = withAuth(
  function onSuccess(req: NextRequest) {
    // Le middleware ne fait rien si l'utilisateur est authentifié
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Appliquer le middleware à toutes les routes /admin
export const config = {
  matcher: ["/admin/:path*"],
};
