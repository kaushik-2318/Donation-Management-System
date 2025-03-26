import { jwtDecode } from "jwt-decode";

export default function getJWTId() {
    try {
        if (typeof window === 'undefined') {
            return null;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Token not found in localStorage");
            return null;
        }

        const decoded = jwtDecode(token);

        if (!decoded || !decoded.id) {
            console.log("Token does not contain an 'id' field");
            return null;
        }

        return { id: decoded.id, role: decoded.role };
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}
