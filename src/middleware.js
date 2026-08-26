import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// কোন পেজগুলো লগইন ছাড়া দেখা যাবে, তা এখানে বলা আছে
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect(); // ড্যাশবোর্ডে যেতে চাইলে লগইন করতে বাধ্য করবে
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};