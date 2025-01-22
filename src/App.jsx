
import CoffeeForm from "./components/CoffeeForm";
import Hero from "./components/Hero";
import History from "./components/History";
import Layout from "./components/Layout";
import Stats from "./components/Stats";
import useAuth from "./hooks/useAuth";

function App() {

  const { globalUser, globalData, isLoading } = useAuth();

  // Fake data to determine authentication status
  const isAuthenticated = globalUser;

  /**
   * Check that global data itself is accessible
   * and 
   * check that the entries of global data is not zero
   */
  const isData = globalData && !!Object.keys(globalData || {}).length;

  const authenticatedContent = (
    <>
        <Stats />
        <History />
    </>
  );

  return (
    <Layout>
        <Hero />
        <CoffeeForm isAuthenticated={isAuthenticated} />
        {isAuthenticated && isLoading && (
          <p>Loading data...</p>
        )}
        {(isAuthenticated && isData) && authenticatedContent}
    </Layout>
  )
}

export default App
