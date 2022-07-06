// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx
import {
  fetchPeopleByPage,
  fetchPeopleInBatches,
} from "./services/PeopleService";
import { IPerson } from "./types/peopleTypes";
import { calculatePower, debounce } from "./utils";

interface IState {
  peopleList: IPerson[];
}

const onMultiplierChange = (value: string) => {
  const tableBody = <HTMLTableElement>document.getElementById("tbody");
  for (let i = 0; i < tableBody?.rows?.length; i++) {
    const powerCell = document.getElementById(`power-${i}`);
    const height = document.getElementById(`height-${i}`)?.innerHTML;
    const mass = document.getElementById(`mass-${i}`)?.innerHTML;
    if (powerCell) {
      powerCell.innerHTML = calculatePower(value, mass, height);
    }
  }
};

const populateTableRows = (data: IPerson[]) => {
  const tableBody = document.getElementById("tbody");
  if (tableBody) {
    tableBody.innerHTML = "";
  }
  for (let i = 0; i < data.length; i++) {
    const row = document.createElement("tr");
    const person = data[i];
    const properties = ["name", "height", "mass", "power"];
    for (let j = 0; j < properties.length; j++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${properties[j]}-${i}`);
      const key = properties[j];
      const cellNodeValue =
        key === "power"
          ? calculatePower("10", person.mass, person.height)
          : person[key];
      const cellText = document.createTextNode(cellNodeValue);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
    row.setAttribute("style", "cursor: pointer;");
    tableBody?.appendChild(row);
  }
};

const setLoading = (isLoading: boolean) => {
  const loaderContainer = document.getElementById("loader");
  if (loaderContainer) {
    loaderContainer!.style.display = isLoading ? "flex" : "none";
  }
};

export const VanillaApp = (() => {
  const state: IState = {
    peopleList: [],
  };
  const initialize = async () => {
    setLoading(true);
    const data = await fetchPeopleByPage(1);
    populateTableRows(data.results);
    state.peopleList = data.results;

    const multiplierInput = document.getElementById("multiplier");
    multiplierInput?.addEventListener("change", (e) =>
      onMultiplierChange(e?.target?.value)
    );

    const filterInput = document.getElementById("filter");
    filterInput?.addEventListener("keyup", debounce(onFilterChange));

    document.addEventListener("keydown", onKeyPress);

    const remainingData = await fetchPeopleInBatches(data);
    const allRecords = [...data.results, ...remainingData];
    populateTableRows(allRecords);
    state.peopleList = allRecords;
    setLoading(false);
  };

  const onFilterChange = (e: any) => {
    const query = e.target.value;
    const filteredPeople = state.peopleList.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    populateTableRows(filteredPeople);
  };

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      const multiplierInput = <HTMLInputElement>(
        document.getElementById("multiplier")
      );
      if (multiplierInput) {
        multiplierInput.value = "10";
      }
      const filterInput = <HTMLInputElement>document.getElementById("filter");
      if (filterInput) {
        filterInput.value = "";
      }
      onMultiplierChange("10");
      populateTableRows(state.peopleList);
    }
  };

  return { initialize };
})();
