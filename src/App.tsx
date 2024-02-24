import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

interface Person {
  firstName: string;
  lastName: string;
  zip: number;
  email: string;
  city: string;
  gender: string;
}
function App() {
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://web-scraping-api-4zao.onrender.com/api/person"
        );
        const personsData = response.data;
        const updatedPersons = await Promise.all(
          personsData.map(async (item: any) => {
            try {
              const genderResponse = await axios.get(
                `https://api.genderize.io/?name=${item.firstName}`
              );
              const gender = genderResponse.data.gender === "male" ? "m" : "f";
              return { ...item, gender };
            } catch (error) {
              console.log("Error fetching gender:", error);
              const gender = "Request limit reached";
              return { ...item, gender };
            }
          })
        );
        setPersons(updatedPersons);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
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
    <div style={{ margin: "0 30px" }}>
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
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person, index) => (
            <tr key={index}>
              <td>{person.firstName}</td>
              <td>{person.lastName}</td>
              <td>{person.zip}</td>
              <td>{person.email}</td>
              <td>{person.city}</td>
              <td>{person.gender || null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
