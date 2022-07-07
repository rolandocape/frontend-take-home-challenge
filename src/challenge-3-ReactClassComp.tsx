import { ChangeEvent, Component, createRef, RefObject } from "react";
import { calculatePower, debounce } from "./utils";
import { IPerson } from "./types/peopleTypes";
import {
  fetchPeopleInBatches,
  fetchPeopleByPage,
} from "./services/PeopleService";

interface IState {
  peopleList: IPerson[];
  filteredPeople: IPerson[];
  loading: boolean;
  multiplier: string;
  filterQuery: string;
}

interface IProps {}

class ClassComp extends Component<{}, IState> {
  private filterInput: RefObject<HTMLInputElement>;

  constructor(props: IProps) {
    super(props);
    this.filterInput = createRef();
    this.state = {
      peopleList: [],
      filteredPeople: [],
      loading: false,
      filterQuery: "",
      multiplier: "10",
    };
  }

  componentDidMount() {
    this.getPeopleData();
    document.addEventListener("keydown", this.onKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyPress);
  }

  onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      this.resetState();
    }
  };

  resetState = () => {
    this.setState({
      filteredPeople: [],
      filterQuery: "",
      multiplier: "10",
    });
    if (this.filterInput.current !== null) {
      this.filterInput.current.value = "";
    }
  };

  getPeopleData = async () => {
    this.setState({
      loading: true,
    });
    const data = await fetchPeopleByPage(1);
    this.setState({
      peopleList: data?.results,
    });
    const remainingData = await fetchPeopleInBatches(data);
    this.setState({
      peopleList: [...data?.results, ...remainingData],
    });
    this.setState({
      loading: false,
    });
  };

  onMultiplierChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      multiplier: e?.target?.value,
    });
  };

  onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: filterQuery } = e.target;
    const filteredPeople = this.state.peopleList.filter((p) =>
      p.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
    this.setState({
      filterQuery,
      filteredPeople,
    });
  };

  render() {
    const { loading, peopleList, multiplier, filterQuery, filteredPeople } =
      this.state;
    const people = filterQuery ? filteredPeople : peopleList;
    return (
      <div id="class-comp">
        <h2>React Class Component</h2>
        Filter:{" "}
        <input
          placeholder="Filter by name"
          ref={this.filterInput}
          onChange={debounce(this.onSearch)}
        />{" "}
        Multiplier:{" "}
        <input
          placeholder="Multiplier"
          type="number"
          min="1"
          max="20"
          value={multiplier}
          onChange={this.onMultiplierChange}
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
                <td>
                  {calculatePower(multiplier, person.mass, person.height)}
                </td>
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
}

export default ClassComp;
