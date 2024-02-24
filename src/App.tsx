import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(persons);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Persons");
    XLSX.writeFile(workbook, "persons.xlsx");
  };

  const exportToCSV = () => {
    const csvData = [
      ["First Name", "Last Name", "Zip Code", "Email", "City"],
      ...persons.map((person) => [
        person.firstName,
        person.lastName,
        person.zip,
        person.email,
        person.city,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "persons.csv";
    a.click();
  };
  return (
    <div>
      <h1>List</h1>
      <div className="button-container">
        <button onClick={exportToExcel}>Export to Excel</button>
        <button onClick={exportToCSV}>Export to CSV</button>
      </div>
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
