import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from 'jose';

// type of JwtPayload
interface JwtPayload {
    email: string;
    iat?: number;
    exp?: number;
}

// helper function to verify jwt using jwtVerify function from jose library
const verifyJWT = async (token: string): Promise<JwtPayload | null> => {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
        if (typeof payload.email == "string")
            return payload as unknown as JwtPayload
        return null
    } catch (error) {
        console.error("Error while verifying JWT");
        return null;
    }
}

export async function middleware(req: NextRequest) {
    // retrieve token from the cookies
    const authToken = req.cookies.get('access_token')?.value;
    const pathname = req.nextUrl.pathname;

    const publicBypassPaths = [
        '/',
        '/api/',
        '/favicon.ico',
        '/_next/static/',    // Next.js static files (JS, CSS)
        '/_next/image/',     // Next.js image optimization files
    ]

    const bypass = publicBypassPaths.includes(pathname)

    if (bypass) {
        if (authToken) {
            return NextResponse.redirect(new URL("/Home", req.url))
        }
        console.log("Hello middleware!")
        return NextResponse.next()
    }

    // if auth token is not available
    if (!authToken) {
        // send back to login page
        return NextResponse.redirect(new URL("/", req.url))
    }

    const payload = await verifyJWT(authToken)
    if (!payload) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    // if auth token is valid, continue
    return NextResponse.next()
}

export const config = {
    // all paths excluding below
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}