import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Signup() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <div className="text-center">
          <h1
            className="text-3xl font-semibold tracking-tight text-[#5B6CFF]"
            style={{ fontFamily: "'Expletus Sans', sans-serif" }}
          >
            Create account
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Get started with InvigilAI
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {/* Primary signup */}
          <button
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { screen_hint: "signup" },
              })
            }
            className="w-full rounded-xl bg-[#5B6CFF] py-3 text-sm font-semibold text-white
                       shadow-lg shadow-[#5B6CFF]/30
                       hover:brightness-110 transition
                       active:scale-[0.97]"
          >
            Continue with Email
          </button>

          {/* Secondary signup */}
          <button
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  screen_hint: "signup",
                  connection: "google-oauth2",
                },
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#5B6CFF] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
