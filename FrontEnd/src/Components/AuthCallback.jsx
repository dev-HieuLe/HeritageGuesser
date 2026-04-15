import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/authContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setAuth, setUser } = useContext(AuthContext);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase puts the session in the URL hash after redirect
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          navigate("/login?error=google_failed");
          return;
        }

        // Exchange Supabase token for our app's JWT cookies
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
          { access_token: session.access_token },
          { withCredentials: true }
        );

        if (res.data.status === "Success") {
          setAuth(true);
          setUser(res.data.user);
          // Sign out from Supabase — our app uses its own JWT system
          await supabase.auth.signOut();
          navigate("/");
        } else {
          navigate("/login?error=google_failed");
        }
      } catch {
        navigate("/login?error=google_failed");
      }
    };

    handleCallback();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#12140e" }}
    >
      <div className="text-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
          style={{ borderColor: "#a2d1bb", borderTopColor: "transparent" }}
        />
        <p style={{ color: "rgba(162,209,187,0.6)", fontSize: "13px" }}>
          Signing you in…
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
