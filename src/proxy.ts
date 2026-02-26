import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = [""]; // mettre le chemin des pages dont on ne peut acceder sans être connecté
const publicRoutes = ["/login"];
const adminRoutes = ["/admin"];

const ADMIN_ID = process.env.ADMIN_CLIENT_ID;

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);

  const c = await cookies();
  const cookie = c.get("session")?.value;
  const session = await decrypt(cookie);

  // non connecté => page login (dashboard ou paiement)
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // page pour les non connecté mais connecté => home page (login ou register)
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // connecté mais pas admin → page d'accueil
  if (isAdminRoute && session?.userId !== ADMIN_ID) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}
