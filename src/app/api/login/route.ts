import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {

        const { username, password } = await req.json();
        const realm_params = {
            grant_type: "password",
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            username,
            password,
        };

        try {
            const response = await fetch(
                `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams(realm_params),
                }
            );
            const data = await response.json();
            if (response.ok) {
                return NextResponse.json(
                    {
                        success: true,
                        message: 'Login successful',
                        data: data
                    },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    {
                        success: false,
                        message:"Login failed",
                        data: null
                    },
                    { status: response.status }
                );
            }
        } catch (error) {
            console.log(error)
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid credentials',
                    data: null
                },
                { status: 401 }
            );
        }
}