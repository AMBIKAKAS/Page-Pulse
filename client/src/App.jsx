import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import Background from "./components/Background";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import ResultSection from "./components/ResultSection";
import Footer from "./components/Footer";

import api from "./utils/api";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const auditWebsite = async () => {
    if (!url.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

    const response = await api.post("/audit", {
  url,
});

      setResult(response.data.data);

      toast.success("Website analyzed successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Background />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <main className="relative min-h-screen overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Hero />

          <SearchBar
            url={url}
            setUrl={setUrl}
            auditWebsite={auditWebsite}
            loading={loading}
          />

          <ResultSection result={result} />

          <Footer />
        </div>
      </main>
    </>
  );
}

export default App;