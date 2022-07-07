import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IPerson } from "./types/peopleTypes";
import {
  fetchPeopleInBatches,
  fetchPeopleByPage,
} from "./services/PeopleService";
import { calculatePower, debounce } from "./utils";

function FunctionalComp() {
  const [peopleList, setPeopleList] = useState<IPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [filteredPeople, setFilteredPeople] = useState<IPerson[]>([]);
  const [multiplier, setMultiplier] = useState<string>("10");
  const filterInput = useRef<HTMLInputElement | null>(null);

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      resetState();
    }
  };

  useEffect(() => {
    getPeopleData();
    document.addEventListener("keydown", onKeyPress);
    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  const resetState = () => {
    setFilterQuery("");
    setFilteredPeople([]);
    setMultiplier("10");
    if (filterInput.current !== null) {
      filterInput.current.value = "";
    }
  };

  const getPeopleData = async () => {
    setLoading(true);
    const data = await fetchPeopleByPage(1);
    setPeopleList(data?.results);
    const remainingData = await fetchPeopleInBatches(data);
    setPeopleList([...data.results, ...remainingData]);
    setLoading(false);
  };

  const onMultiplierChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMultiplier(e?.target?.value);
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilterQuery(value);
    setFilteredPeople(
      peopleList.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const people = filterQuery ? filteredPeople : peopleList;

  return (
    <div id="functional-comp">
      <h2>React Functional Component</h2>
      Filter:{" "}
      <input
        placeholder="Filter by name"
        ref={filterInput}
        onChange={debounce(onSearch)}
      />{" "}
      Multiplier:{" "}
      <input
        placeholder="Multiplier"
        type="number"
        min="1"
        max="20"
        value={multiplier}
        onChange={onMultiplierChange}
      />{" "}
      Press "Escape" to reset fields
      <table width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Mass</th>
            <th>Power</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.name}>
              <td>{person.name}</td>
              <td>{person.height}</td>
              <td>{person.mass}</td>
              <td>{calculatePower(multiplier, person.mass, person.height)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div className="loader-container">
          <div className="loader" />
        </div>
      )}
    </div>
  );
}

export default FunctionalComp;
