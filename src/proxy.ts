export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/owner/:path*", "/client/:path*", "/login", "/register"],
};
