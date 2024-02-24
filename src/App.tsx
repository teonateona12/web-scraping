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
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Zip Code</th>
            <th>Email</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person, index) => (
            <tr key={index} style={{ margin: "60px" }}>
              <td>{person.firstName}</td>
              <td>{person.lastName}</td>
              <td>{person.zip}</td>
              <td>{person.email}</td>
              <td>{person.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
