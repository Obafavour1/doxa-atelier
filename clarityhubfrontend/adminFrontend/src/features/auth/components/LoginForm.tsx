import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSignIn } from "../api/hooks/hooks";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const signInMutation = useSignIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signInMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Logged in successfully");
          navigate("/");
        },
        onError: (err: any) => {
          const message =
            err.response?.data?.message || err.message || "Login failed";
          toast.error(message);
        },
      },
    );
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-rose-400">
          Create your account
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className=" block w-full pl-10 px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 
									focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className=" block w-full pl-10 px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 
									focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={signInMutation.isPending}
              className="w-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed w-full transition duration-150 ease-in-out"
            >
              {signInMutation.isPending ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Loading...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                  Login
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-medium text-rose-400 hover:text-rose-300"
            >
              Sign up now <span aria-hidden="true">&rarr;</span>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default LoginForm;
