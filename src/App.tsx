import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import axios from "axios";
interface Person {
  firstName: string;
  lastName: string;
  zip: number;
  email: string;
  city: string;
}
function App() {
  const [persons, setPersons] = useState<Person[]>([]);
  useEffect(() => {
    const getPersons = async () => {
      try {
        const response = await axios.get(
          "https://web-scraping-api-4zao.onrender.com/api/person"
        );
        setPersons(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPersons();
  }, []);
  return (
    <div>
      <h1>List</h1>
    </div>
  );
}

export default App;
