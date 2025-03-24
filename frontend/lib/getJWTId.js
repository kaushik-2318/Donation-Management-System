import { jwtDecode } from "jwt-decode";

export default function getJWTId() {
    try {
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
        return decoded.id;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}
