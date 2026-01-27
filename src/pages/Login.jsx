import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
  const { loginWithRedirect, isLoading } = useAuth0();
  if (isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <div className="text-center">
          <h1
            className="text-3xl font-semibold tracking-tight text-[#5B6CFF]"
            style={{ fontFamily: "'Expletus Sans', sans-serif" }}
          >
            InvigilAI
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Secure access to your dashboard
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => loginWithRedirect()}
            className="w-full rounded-xl bg-[#5B6CFF] py-3 text-sm font-semibold text-white
                       shadow-lg shadow-[#5B6CFF]/30
                       hover:brightness-110 transition
                       active:scale-[0.97]"
          >
            Continue with Email
          </button>
          <button
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { connection: "google-oauth2" },
              })
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-gray-200
                       hover:bg-white/10 transition
                       active:scale-[0.97]"
          >
            Continue with Google
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          No account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#5B6CFF] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
