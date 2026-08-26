import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// এই পেজগুলো লগইন ছাড়া দেখা যাবে
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    // protect() এর বদলে আমরা ম্যানুয়ালি চেক করছি ইউজার লগইন করেছে কি না
    const { userId } = auth();
    
    if (!userId) {
      // ইউজার না থাকলে তাকে রিডাইরেক্ট করে লগইন পেজে পাঠিয়ে দেবে
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};