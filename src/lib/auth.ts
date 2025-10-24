import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded;
};

export const getAuthUser = async (request: NextRequest) => {
  const decoded = authenticateToken(request);

  if (!decoded) {
    return null;
  }

  // You can optionally fetch user details from database here
  return {
    userId: decoded.userId,
    email: decoded.email,
  };
};
