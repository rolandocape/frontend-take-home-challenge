import { IPeople, IPerson } from "../types/peopleTypes";

const baseUrl = "https://swapi.dev/api/people";

export const fetchPeopleByPage = async (
  pageNumber: number
): Promise<IPeople> => {
  const queryParams = new URLSearchParams(`page=${pageNumber}`);
  const response = await fetch(`${baseUrl}?${queryParams}`);
  return await response.json();
};

export const fetchPeopleInBatches = async (
  data: IPeople,
  batchSize = 5
): Promise<IPerson[]> => {
  let responses: IPeople[] = [];
  const totalPages = Math.ceil(data?.count / data?.results?.length);
  const pagesBatch: number[] = [];
  let pageNumber = 2;
  while (pageNumber <= totalPages) {
    pagesBatch.push(pageNumber);
    if (pagesBatch.length === batchSize || pageNumber === totalPages) {
      responses = [
        ...responses,
        ...(await Promise.all(
          pagesBatch.map((page) => fetchPeopleByPage(page))
        )),
      ];
      pagesBatch.splice(0, pagesBatch.length);
    }
    pageNumber++;
  }
  let totalRecords: IPerson[] = [];
  responses.forEach((res) => {
    const { results = [] } = res || {};
    totalRecords = [...totalRecords, ...results];
  });
  return totalRecords;
};

/* Fetch data with no batches */
// export const fetchPeople = async (data: IPeople) => {
//   let totalRecords: IPerson[] = [];
//   const totalPages = Math.ceil(data?.count / data?.results?.length);
//   let pageNumber = 2;
//   while (pageNumber <= totalPages) {
//     const response = await fetchPeopleByPage(pageNumber);
//     totalRecords = [...totalRecords, ...response.results];
//     pageNumber++;
//   }
//   return totalRecords;
// };
